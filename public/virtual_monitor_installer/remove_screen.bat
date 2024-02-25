@cd /d "%~dp0"

@goto %PROCESSOR_ARCHITECTURE%
@exit

:AMD64
@echo off

rem Check if the driver is installed
pnputil /enum-drivers | find "usbmmidd"

rem If the driver is not installed, then install it
if %errorlevel% neq 0 (
    @cmd /c deviceinstaller64.exe install usbmmidd.inf usbmmidd
) else (
    echo Driver already installed
)
@REM @cmd /c deviceinstaller64.exe install usbmmidd.inf usbmmidd
@cmd /c deviceinstaller64.exe enableidd 0
@goto end

:x86
@echo off

rem Check if the driver is installed
pnputil /enum-drivers | find "usbmmidd"

rem If the driver is not installed, then install it
if %errorlevel% neq 0 (
    @cmd /c deviceinstaller.exe install usbmmidd.inf usbmmidd
) else (
    echo Driver already installed
)
@REM @cmd /c deviceinstaller.exe install usbmmidd.inf usbmmidd
@cmd /c deviceinstaller.exe enableidd 0

:end
@pause
