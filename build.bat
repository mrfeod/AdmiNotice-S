RMDIR /s /q .\build
xcopy /Y .\key .\build
xcopy /Y .\*.html .\build
nexe -i index.js -o ./build/server.exe
