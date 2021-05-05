@echo off

:: Checks if we have Admin. If we don't, then we ask the user to restart.
net session >nul 2>&1
if not %errorlevel%==0 (
    echo You need to run this as Administrator.
    echo To do that, Right Click the File, and select Run as Administrator.
    PAUSE
    exit
)

:: Gives details
echo Hey there,
echo I'm a one in all Install Script for Windows 10.
echo I will copy paste Cmder and FFmpeg to the right Folder, and Drive. 
echo Make sure that the paths in the config.bat file beside me are correct.
echo I will also make sure that the ENV Variables are set perfectly.
echo Thank you for giving me Admin Perms

PAUSE

echo Checking Internet Connection
Ping www.google.nl -n 1 -w 1000
if errorlevel 1 (
    echo You have not connected to the Internet. I will quit the Script. Please start again after connecting to the Internet
    PAUSE
    exit
)


echo Enabling SystemRestore (If not enabled) 
powershell -Command "Enable-ComputerRestore -Drive C:"
powershell -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description \"Before Apps Installation\" -RestorePointType \"MODIFY_SETTINGS\""

:: Chocolatey Install
echo Checking config
call config.bat

echo Installing Choco
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

choco feature enable -n allowGlobalConfirmation
:: Disables Choco installing Confirmation so that we don't need to answer prompts each time.
:: To re-enable, just run `choco feature disable -n allowGlobalConfirmation` from your CLI.

:: The FOR /L Loops from 0-14 of the app variable, and installs each of them.
for /l %%i in (0,1,100) do (
    if not defined app[%%i] (
        goto discord
    ) else (
        call echo %%app[%%i]%%
        call choco install %%app[%%i]%%
    )
)

:: This is an example prompt, to just show how this works.
:discord 
    set /p discordinstall=Do you want to install Discord? (Y/N) 
    if /i "%discordinstall:~,1%" EQU "Y" choco install discord && goto BSOD
    if /i "%discordinstall:~,1%" EQU "N" goto BSOD
    echo Please type Y/N
    goto discord
:--------------------------------------

cls

:BSOD
    if defined BSODLogging (
        echo Setting your BSOD Logging Type to %BSODLogging%
        REG ADD "HKLM\System\CurrentControlSet\Control\CrashControl" /v CrashDumpEnabled /d %BSODLogging% /t REG_DWORD /f
        goto Env
    ) else (
        set /p BSODQuestion=BSODLogging Variable has not been set. Do you want me to set it to the default Small Memory Dump (Y) or leave it (N) 
        if /i "%BSODQuestion:~,1%" EQU "Y" REG ADD "HKLM\System\CurrentControlSet\Control\CrashControl" /v CrashDumpEnabled /d 0x3 /t REG_DWORD /f && goto Env
        if /i "%BSODQuestion:~,1%" EQU "N" echo "Ok, skipping" && goto Env
        echo Please type Y/N
        goto BSOD
    )
:--------------------------------------

:Env
    cls
    :: Asks for confirmation.
    echo Shall I go ahead with Cmder and FFmpeg?
    echo If yes, press any key to continue.
    echo If no, click the close button (DO NOT PRESS ALT + F4).
    echo If you wish to continue, I will install 7-Zip.
    echo You can uninstall it later, through a prompt I'll give you :)
    PAUSE

    echo Installing 7-Zip and Nodejs-LTS
    choco install 7zip nodejs-lts

    call refreshenv.cmd

    :: Checks if Nodejs is installed.
    node -v > tmp.txt
    set /p NODE_VER=<tmp.txt
    del tmp.txt
    if %NODE_VER% EQU null (
        echo Nodejs is NOT installed. Install it
        echo Quitting Installation
        PAUSE
        exit
    ) else (
        :: We run the index file
        node index.js
    )
    call refreshenv.cmd

    echo Copying Cmder
    robocopy %CmderDirectory% %CmderInstallDirectory% /E /V

    Cmder /REGISTER USER

    echo Setting Cmder Vars
    setx CMDER_ROOT %CmderInstallDirectory% /m

    echo Copying FFmpeg
    robocopy %FFmpegDirectory% %FFmpegInstallDirectory% /E /V
    echo Set FFmpeg Vars Already

    goto 7zip
:--------------------------------------

:7zip
    set /p zip=Do you want to uninstall 7zip? (Y/N) 
    if /i "%zip:~,1%" EQU "Y" choco uninstall 7zip && exit
    if /i "%zip:~,1%" EQU "N" echo Exiting && exit
    echo Please enter a valid answer. Reprompting
    goto 7zip
:--------------------------------------

:restart
    set /p reboot=You need to reboot to finish the installation. Shall I do it now? (Y/N) 
    if /i "%reboot:~,1%" EQU "Y" echo Rebooting in 1 minute && shutdown /r /t 60 /c "Complete installation"
    if /i "%reboot:~,1%" EQU "N" echo Please manually reboot later && exit
    echo Please enter a valid answer. Reprompting
    goto restart
:--------------------------------------