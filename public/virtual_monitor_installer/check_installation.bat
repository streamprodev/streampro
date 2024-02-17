@cd /d "%~dp0"

@goto %PROCESSOR_ARCHITECTURE%
@exit

:AMD64
@cmd /c deviceinstaller64 find @ROOT\DISPLAY\0000

@goto end

:x86
@cmd /c deviceinstaller find @ROOT\DISPLAY\0000

:end
@pause
