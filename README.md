# descriptive.worm
> Handle parameters of your system in a structured way. [WIP]
<hr>

The goal of this project is to offer a structured way to handle 
several parameters of your system. Basically you create profiles
that contain information of your current setup. Profiles contain
the following information:

- your bash PS1 prompt
- a path to a file that contains paths that you want to your path
- a path to a file that contains files that you want to run on startup
- a path to a file that contains aliases
- a path to a file that contains commands that you want to run startup

All the profiles that are created are inserted into a config file

[Sample Config File]
```json
[
    {
        "_id": "59e19a7b-baa3-415b-a43e-02c32b144b7d",
        "_name": "main",
        "_isActive": true,
        "_ps1": "->",
        "_pathsFile": "./profiles/main/paths.json",
        "_startupFile": "./profiles/main/startup.json",
        "_aliasesFile": "./profiles/main/aliases.json",
        "_startupCommandsFile": "./profiles/main/startup-commands.json",
        "_extensions": []
    }
]
```

[Sample Paths File]
```json
[
  "~/project/bin",
  "/usr/bin"
]
```

[Sample Startup File]
```json
[
  "~/welcome.sh",
  "~/print_memory_usage.sh"
]
```

[Sample Aliases File]
```json
{
  "CD": "cd",
  "rs": "exec $SHELL"
}
```

[Sample Startup Commands File]
```json
[
  "neofetch",
  "docker container ls"
]
```


Profiles can also contain extensions. Each profile can contain
multiple extensions.


[Sample Extension Config File]

```json
{
  "_id": "97f8f4bd-9693-47a6-a612-24a2a34d5414",
  "_name": "descriptive.worm.private",
  "_pathsFile": "./profiles/descriptive.worm.private/paths.json",
  "_startupFile": "./profiles/descriptive.worm.private/startup.json",
  "_aliasesFile": "./profiles/descriptive.worm.private/aliases.json",
  "_startupCommandsFile": "./profiles/descriptive.worm.private/startup-commands.json",
  "_extensions": [
  ]
}

```
