# Release and Deployment Guidelines

Actions described in this document are reserved for administrators. They are presented here as a reference, but also with the intent of transparency.


---


## Releasing

This project is not a library on which other projects depend. As such, its releases are a combination of [Sentimental Versioning](http://sentimentalversioning.org/) and [SemVer](https://semver.org/), MAJOR.FEATURE.FIX:

- **Fix**: Similar to SemVer, this update means a correction. For example, this could mean a corrected broken functionality or a correction in layout.

- **Feature**: Also similar to SemVer, this is when a feature is added. However, this definition might be a bit looser.

- **Major**: Major changes in this context usually would mean the addition of a new language.


---


## Deploying

### Without Changes in Assets or Database

1. Connect to the remote location via SSH (requires admin access)

2. Go to the project directory

3. Obtain the latest changes with `git pull`

4. Restart the project with `pm2 restart ecosystem.config.js`

5. Wait a few moments, and then see the changes on <https://arts-et-medias.net/>


### With Changes in Assets or Database

TODO ([#82](https://github.com/jansensan/arts-et-medias/issues/82))
