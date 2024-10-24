@echo off
goto check_Permissions

:check_Permissions
    echo Administrative permissions required. Detecting permissions...
    
    net session >nul 2>&1
    if %errorLevel% == 0 (
        echo Success: Administrative permissions confirmed.
        goto run
    ) else (
        echo Failure: Current permissions inadequate.
        goto exit
    )
    
    pause >nul
:run
	set HOST=192.168.1.160
	set HOST_PORT=4000
	set DEV_PORT=8300

	cd /D "%~dp0"
	call npm install
	call npm run pack

	cd ./server
	call npm install
	call npm run start

:exit
	@pause