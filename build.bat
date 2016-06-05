RMDIR /s /q .\build
xcopy /D /E /C /R /I /K /Y .\cfg .\build\cfg
xcopy /D /E /C /R /I /K /Y .\src .\build\src
nexe -i index.js -o ./build/server.exe
