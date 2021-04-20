<h1 align="center">Welcome to PC-Setup 👋</h1>
<p>
  <a href="https://github.com/WickedWizard3588/PC-Setup/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

You can read the Comments in each file, and know what it does :_) Enjoy

> Just an app that sets up your PC Apps and Environment variables after a reset.

Disclaimer: Works on Windows 10, unless your Registry is broken. 
> Should work on Windows 8, 7 (Untested)

## Usage
Download this repo and unzip it.
Rename `config.example.bat` to `config.bat` and fill the file.
Run the install.bat File

## Prerequisites
~~Install FFmpeg (If needed)~~ No longer needed, thanks to an idea from [SpeckyYT](https://github.com/SpeckyYT/) and [BlackWolfWoof](https://github.com/BlackWolfWoof)<br>
Just a PC and Cmder (If you want it) are enough.

# How it works?
Basically, when you set your config in the `config.bat` file, and run the `install.bat` file, it first installs Chocolatey. [Chocolatey/Choco](https://chocolatey.org/) is a package manager for Windows, like `APT` in Ubuntu and `Homebrew` in Mac. Then, Choco loops through the array you set in the config file. (Allows up to 14 packages.)

# Backup
As this Program Indirectly modifies your Registry, it can be harmful, but only for your Environment Variables.

How does it modify the Registry?
All your Environment Variables are stored in the registry. We read the Environment Variables from there. If there is any messing with the Registry, it will most probably be with your PATH Variables.

So, I recommend you to take backup by reading the [Backup.md](https://github.com/WickedWizard3588/PC-Setup/blob/master/Backup.md) file.

> This might be integrated into the Project later

# Contributing
If you want to contribute to this project, feel free to do so. Just make sure that the idea is appealing and you have a nice way of implementing it.

# License 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## TL;DR
You can do anything with this as long as you credit/mention me for it. 

Oh, and you can't sue me if it blows up
