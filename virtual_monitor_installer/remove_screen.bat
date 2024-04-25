@cd /d "%~dp0"

@goto %PROCESSOR_ARCHITECTURE%
@exit

:AMD64
@echo off

rem Check if the driver is installed
pnputil /enum-drivers | find "usbmmidd"

rem If the driver is not installed, then install it
if %errorlevel% equ 0 (
    echo Driver already installed
    @cmd /c deviceinstaller64.exe enableidd 0
) 
@goto end

:x86
@echo off

rem Check if the driver is installed
pnputil /enum-drivers | find "usbmmidd"

rem If the driver is not installed, then install it
if %errorlevel% equ 0 (
    echo Driver already installed
    @cmd /c deviceinstaller.exe enableidd 0
)

:end
@pause
