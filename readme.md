# sh-script-builder

This cli utility builds a sh project directory into a .tar file.

_Project structure_
Setup your project in the following way for this utility to work correctly

- project-name
  - index.sh _<- entry point for script. invoke modules here_
  - modules _<- put all modules here_
    - {name}.sh
    - ...
  - assets _<- put all required assets here_

_tar structure_

- project-name.tar
  - index.sh _<- entry point for the script_
  - assets _<- holds all required assets for the script_

_Invoking the script_

```sh
$ sh-scipt-build /path/to/your/project outputName.tgz
```
