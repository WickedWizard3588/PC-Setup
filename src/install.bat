@echo off

:: Checks if we have Admin. If we don't, then we ask the user to restart.
net session >nul 2>&1
if not %errorlevel%==0 (
    echo You need to run this as Administrator.
    echo To do that, Right Click the File, and select Run as Administrator.
    PAUSE
    exit
)

:: Checks if we have internet.
:internet
    Ping www.google.nl -n 1 -w 1000
    if errorlevel 1 (
        echo You have not connected to the Internet. Please connect to the internet
        PAUSE
        goto internet
    )
    goto intro
:--------------------------------------

:intro
    echo Hello there,
    echo I'm the interactive PC-Setup Script for Windows.
    echo I take in input from you, the user, and then try to search and install those apps.
    echo Can we continue?
    PAUSE
    goto choco
:--------------------------------------

:choco
    echo Installing Chocolatey, the Package Manager for Windows
    @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
    echo Enabling allowGlobalConfirmation
    choco feature enable -n allowGlobalConfirmation
    choco install nodejs-lts
    if not exist C:\Windows\System32\curl.exe (
        choco install curl
    )
    call refreshenv.cmd
    echo I have finished my setup part. Can we start installing apps?
    PAUSE
    node index.js
:--------------------------------------
