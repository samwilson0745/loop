// The app uses React Native's legacy architecture on Windows. Fabric-only
// codegen targets are replaced with this empty translation unit to keep Ninja
// object paths below the Windows MAX_PATH limit.
extern "C" int loop_fabric_codegen_stub() { return 0; }
