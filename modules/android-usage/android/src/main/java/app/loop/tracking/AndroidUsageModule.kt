package app.loop.tracking

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AndroidUsageModule : Module() {
  private fun applicationLabel(context: Context, packageName: String): String {
    return try {
      val info = if (Build.VERSION.SDK_INT >= 33) {
        context.packageManager.getApplicationInfo(packageName, PackageManager.ApplicationInfoFlags.of(0))
      } else {
        @Suppress("DEPRECATION")
        context.packageManager.getApplicationInfo(packageName, 0)
      }
      context.packageManager.getApplicationLabel(info).toString()
    } catch (_: Exception) { packageName }
  }

  override fun definition() = ModuleDefinition {
    Name("AndroidUsage")

    AsyncFunction("getPermissionStatus") {
      val context = appContext.applicationContext
      val ops = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
      @Suppress("DEPRECATION")
      val mode = ops.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.packageName)
      mode == AppOpsManager.MODE_ALLOWED
    }

    AsyncFunction("openUsageAccessSettings") {
      val context = appContext.applicationContext
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
    }

    AsyncFunction("queryUsage") { begin: Long, end: Long ->
      val context = appContext.applicationContext
      val ops = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
      @Suppress("DEPRECATION")
      val allowed = ops.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.packageName) == AppOpsManager.MODE_ALLOWED
      if (!allowed) throw SecurityException("Usage Access is not enabled")
      val manager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val appRows = manager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, begin, end).orEmpty()
        .filter { it.totalTimeInForeground > 0 && it.packageName != context.packageName }
        .groupBy { it.packageName }
        .map { (pkg, rows) ->
          val label = applicationLabel(context, pkg)
          mapOf("packageName" to pkg, "displayName" to label, "durationMs" to rows.sumOf { it.totalTimeInForeground })
        }
      val eventsOut = mutableListOf<Map<String, Any>>()
      val events = manager.queryEvents(begin, end)
      if (events != null) {
        val event = UsageEvents.Event()
        while (events.hasNextEvent()) {
          events.getNextEvent(event)
          val type = event.eventType
          val foreground = type == UsageEvents.Event.MOVE_TO_FOREGROUND || (Build.VERSION.SDK_INT >= 29 && type == UsageEvents.Event.ACTIVITY_RESUMED)
          val background = type == UsageEvents.Event.MOVE_TO_BACKGROUND || (Build.VERSION.SDK_INT >= 29 && type == UsageEvents.Event.ACTIVITY_PAUSED) || (Build.VERSION.SDK_INT >= 29 && type == UsageEvents.Event.ACTIVITY_STOPPED)
          val pkg = event.packageName ?: continue
          if ((foreground || background) && pkg != context.packageName) {
            eventsOut.add(mapOf("packageName" to pkg, "eventType" to if (foreground) "FOREGROUND" else "BACKGROUND", "timestamp" to event.timeStamp))
          }
        }
      }
      mapOf("permission" to true, "apps" to appRows, "events" to eventsOut)
    }
  }
}
