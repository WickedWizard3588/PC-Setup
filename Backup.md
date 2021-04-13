<h1 align="center">Registry Backup</h1>

As mentioned in [README.md](https://github.com/WickedWizard3588/PC-Setup#readme), you can take a Registry Backup, or create a System Restore Point.

* Create a System Restore Point
    1. Press Windows Key + R
    2. Type `sysdm.cpl` and hit Enter
    3. Go to System Protection Tab
    4. Make sure System Protection is on only for your Windows Drive. (Mostly C)
    5. Click on Create
    6. Wait for the process to complete
    7. You have a System Restore point ready now!!

* Take a Full Registry Backup (Not recommended due to sheer size and time taken)
    1. Press Windows Key + R
    2. Type `regedit` and hit enter
    3. If you have UAC enabled, hit Yes
    4. Click on File and hit Export
    5. Save it to a suitable place.
    6. Wait for it to complete saving, and then close the registry.
    7. You have a FULL Registry Backup Now.
        * To restore, you just need to double click the file, give it admin permissions and wait until it finishes.

* Take Backup of Environment Variables
    1. Press Windows Key + R
    2. Type `regedit` and hit Enter
    3. If you have UAC enabled, hit yes
    4. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment`
    5. Click File in the top menu and hit Export
    6. Save this File as `System Variables`
    7. Go back to the root of the Registry and then navigate to `HKEY_CURRENT_USER\Environment`
    8. Again click Export and save this file as Environment Variables.
        * To restore, just double click the file, give it admin permissions, and wait until it finishes.


Now, you have a successful backup in place, which you can restore to at anytime.