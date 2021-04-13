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

echo Checking config
call config.bat

:: Chocolatey Install
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
    set /p answer=Do you want to install Discord? (Y/N) 
    if /i "%answer:~,1%" EQU "Y" choco install discord && goto Env
    if /i "%answer:~,1%" EQU "N" goto Env
    echo Please type Y for Yes or N for No
    goto discord
:--------------------------------------

:Env
    :: Asks for confirmation.
    echo Shall I go ahead with Cmder and FFmpeg?
    echo If yes, press any key to continue.
    echo If no, press Alt + F4.
    echo If you wish to continue, I will install 7-Zip.
    echo You can uninstall it later, through a prompt I'll give you :)
    PAUSE

    echo Installing 7-Zip.
    choco install 7zip

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

    echo Setting Cmder Vars
    setx CMDER_ROOT %CmderInstallDirectory% /m

    echo Copying FFmpeg
    robocopy %FFmpegDirectory% %FFmpegInstallDirectory% /E /V
    echo Set FFmpeg Vars Already
:--------------------------------------

:7zip
    echo Do you want to uninstall 7zip?
    echo If yes, click Enter
    echo If no, click Alt + F4 and you can quit the installation safely
    PAUSE
    choco uninstall 7zip

    echo Uninstalled 7zip. Now quitting.
    PAUSE
    exit
:--------------------------------------