<h1 align="center">Welcome to PC-Setup 👋</h1>

## What is this?

In One Sentence,
> An intuitive Command Line Tool to install all your apps back on Windows. 

Elaborately,
PC-Setup, is an Command Line Tool, which is meant to install all your desired apps on Windows. It uses [Chocolatey](https://chocolatey.org/), a Package Manager for Windows to do this. It also can install 

* [Cmder](https://cmder.net/), which is an Console Emulator for Windows, created purely out of frustration because of the lack of none.
* [FFmpeg](https://ffmpeg.org/), which is `A complete, cross-platform solution to record, convert and stream audio and video.`, as quoted in the website.

Moreover, you can also set Environment Variables (like `PATH`) for Cmder and FFmpeg, as per instructed.


## How to use?
1. Download the Latest Release from [here](https://github.com/WickedWizard3588/PC-Setup/releases). Download the Zip File only.
2. Unzip the file using Windows Explorer.

3. The running of the app can be split in two different parts. (Note that this will work with Command Prompt only.)
    * With Config
        - First, create a `config.json` beside the `package.json` file.
        - Fill in the necessary info.
        - A Nice, Prebuilt Config.json could look like this
        ```json
        // Just leave an empty array/object if you don't want to run that part of the script.
        {
            // All the apps that you want to install. Just put the Chocolatey App ID from this website https://community.chocolatey.org/packages.
            "apps": [
                "gh",
                "git",
                "vscode"
            ],
            // Windows Subsystem for Linux (WSL). If you don't know what it is, read it from here https://aka.ms/wsl
            "wsl": {
                "default-version": 2, // Default Version for WSL. 
                "upgrade": true, // Want to upgrade to WSL2?
                "ubuntu": true // Want to install Ubuntu as your default WSL distribution?
            },
            // Cmder, the Console Emulator for Windows. Explained above.
            "cmder": {
                "environmentVariables": true, // If you want to set the Environment Variables.
                "finalDirectory": "C:\\Cmder", // The directory where Cmder should reside. 
                "context-menu": true, // If you want Cmder in to Context Menu of your Windows Explorer. Right click on the Folder Name, and see the popup.
                "global": true // If the Environment Variables need to be set at a Global Level.
            },
            // FFmpeg, the Audio and Video Encoder.
            "ffmpeg": {
                "environmentVariables": true, // If you want to set the Environment Variables.
                "finalDirectory": "C:\\FFmpeg", // The directory where FFmpeg should reside.
                "global": true // If the Environment Variables need to be set at a Global Level.
            }
        }
        ```
        - Save this file, and open Command Prompt as Admin.
        - `cd` to the Folder Containing this code.
        - `cd` to the src folder.
        - Type `install`

    * Without Config
        - Open Command Prompt as Admin
        - `cd` to the Folder Containing this code.
        - `cd` to the src folder.
        - Type `install`.
        - After you're finished, it even writes a `config.json` with your permission

4. It might take quite sometime, to install all the apps and complete the setup, especially if you don't have the `config.json`.

5. You're done.

## TODO
- [ ] Allow changing behaviour of Alt + Tab
- [ ] Allow Creating a System Restore Point at every startup
- [ ] Check if Git has been installed, and set Name, Email and Core Editor
- [ ] Allow Cmder [Autoruns](https://github.com/cmderdev/cmder/wiki/Cmder's-shell-in-other-terminals#add-to-autorun).
- [ ] Allow you own custom script to be pasted in the `System32` Directory

## License

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

### TL;DR
Do any modifications as long as you mention/credit me.

No warranty has been provided on this script.

You cannot sue me if something blows up
