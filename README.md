<h1 align="center">Welcome to PC-Setup 👋</h1>

## What is this?
`PC-Setup` is a script which reinstalls all your Windows 10 apps using Chocolatey, the Package Manager for Windows.
You just need to download and unzip this repo, rename the `config.example.bat` to `config.bat`, fill it, and run your `install.bat` file. Also, make sure that the app you are trying to install is available [here](https://community.chocolatey.org/packages).

**Disclaimer:** This app indirectly modifies your PC's Registry which can be harmful. Fortunately, we create a System Restore Point just before we start, so that we can revert back easily.

This script also sets your BSOD (Blue Screen of Death) Dump Files to the `MiniDump` option, so its easy for you to debug and fix them ;)

PS:- If you're a fan of [Cmder](https://cmder.net/) and [FFmpeg](https://www.ffmpeg.org/), this app automatically installs Cmder and FFmpeg for you, including the Environment Variables. 

### Prerequisites
None

_If you find a bug, or have new Ideas, please feel free to open an issue or PR or contact me through [Discord](http://discord.com/users/719421577086894101)_

### License 
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
