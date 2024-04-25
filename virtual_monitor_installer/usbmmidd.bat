@cd /d "%~dp0"

@goto %PROCESSOR_ARCHITECTURE%
@exit

:AMD64
@REM @echo off

rem Check if the driver is installed
pnputil /enum-drivers | find /i "usbmmidd" 

rem If the driver is not installed, then install it
if %errorlevel% equ 0 (
    @cmd /c deviceinstaller64.exe enableidd 1
    echo Driver already installed
) else (
    @cmd /c deviceinstaller64.exe install usbmmidd.inf usbmmidd
    @cmd /c deviceinstaller64.exe enableidd 1
)
@goto end

:x86
@REM @echo off

rem Check if the driver is installed
pnputil /enum-drivers | find /i "usbmmidd" 

rem If the driver is not installed, then install it
if %errorlevel% equ 0 (
    @cmd /c deviceinstaller.exe enableidd 1
    echo Driver already installed
) else (
    @cmd /c deviceinstaller.exe install usbmmidd.inf usbmmidd
    @cmd /c deviceinstaller.exe enableidd 1
)

:end
