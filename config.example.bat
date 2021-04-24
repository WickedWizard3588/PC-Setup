:: Edit all your Data here
:: DO NOT USE QUOTES
@echo off

set CmderInstallDirectory=YOUR_DIRECTORY_HERE
set CmderDirectory=YOUR_DIRECTORY_HERE
set FFmpegInstallDirectory=YOUR_DIRECTORY_HERE
set FFmpegDirectory=YOUR_DIRECTORY_HERE
set setupFilesDirectory=YOUR_DIRECTORY_HERE
set codingDirectory=YOUR_DIRECTORY_HERE

set app[0]=YOUR_APP_NAME_HERE
set app[1]=YOUR_APP_NAME_HERE
set app[2]=YOUR_APP_NAME_HERE
set app[3]=YOUR_APP_NAME_HERE
set app[4]=YOUR_APP_NAME_HERE
set app[5]=YOUR_APP_NAME_HERE
set app[6]=YOUR_APP_NAME_HERE
set app[7]=YOUR_APP_NAME_HERE
set app[8]=YOUR_APP_NAME_HERE
set app[9]=YOUR_APP_NAME_HERE
set app[10]=YOUR_APP_NAME_HERE
set app[11]=YOUR_APP_NAME_HERE
set app[12]=YOUR_APP_NAME_HERE
set app[13]=YOUR_APP_NAME_HERE
set app[14]=YOUR_APP_NAME_HERE

:: Make sure the below option is defined, else it will break your BSOD Logging, in the Registry.
:: Leave it as it is if you don't understand it
set BSODLogging=0x3
:: There are 4 types of logging here,
:: Option:-
:: `0x0` No Logging
:: `0x1` Complete Memory Dump
:: `0x2` Kernel Memory Dump
:: `0x3` Small Memory Dump
:: `0x7` Automatic Memory Dump

:: You can now install upto 100 apps. If you need to install just 25 apps, then the last line should be
:: set app[25]=APP_NAME
:: You can leave it empty after this
:: The install.bat will take care of it.
:: Make sure the apps that you want to install are present here https://community.chocolatey.org/packages
