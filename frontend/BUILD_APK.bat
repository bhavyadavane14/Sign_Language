@echo off
REM ============================================================
REM  SignX ISL Translator ? APK Build Script
REM  Run this AFTER Android Studio / JDK is installed
REM ============================================================

cd /d "%~dp0"
echo [1/3] Building production web bundle...
call npm run build
if %errorlevel% neq 0 ( echo BUILD FAILED & pause & exit /b 1 )

echo [2/3] Syncing web assets to Android project...
call npx cap sync android
if %errorlevel% neq 0 ( echo SYNC FAILED & pause & exit /b 1 )

echo [3/3] Building debug APK with Gradle...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 ( echo GRADLE BUILD FAILED & pause & exit /b 1 )

echo.
echo ============================================================
echo  APK READY:
echo  android\app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
pause
