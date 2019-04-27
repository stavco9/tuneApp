@echo off
cd %1
for /f "tokens=1,* delims= " %%a in ("%*") do set CONDA_PYTHON_ARGS=%%b
Scripts\activate %cd% && python %CONDA_PYTHON_ARGS%