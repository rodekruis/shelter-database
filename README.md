# Shelter Database

## Presentation

The goal of this application is to list the shelters deployed around the world.

The official instance is available [here](https://shelter-database.org).


## Deployment

### Requirements

```bash
$ sudo apt-get install postgresql npm
```

Also it seems that today a proof of good taste is to install first
[pyenv](https://github.com/pyenv/pyenv),
then [pipsi](https://github.com/mitsuhiko/pipsi), and finally
[pew](https://github.com/berdario/pew) and
[pipenv](https://github.com/pypa/pipenv) with pipsi.


### Configure and install the application

### Database configuration

```bash
$ ./create_db.sh shelter pgsqluser pgsqlpwd
```

### Application

```bash
~/git$ git clone https://github.com/rodekruis/shelter-database.git
~/git$ cd shelter-database/
~/git/shelter-database$ cp src/conf/conf.cfg-sample src/conf/conf.cfg
~/git/shelter-database$ pipenv install
✨🍰✨
~/git/shelter-database$ pipenv shell

(shelter-database-JZplA0Yt) ~/git/shelter-database$ npm install

(shelter-database-JZplA0Yt) ~/git/shelter-database$ ./create_db.sh shelter pgsqluser pgsqlpwd
(shelter-database-JZplA0Yt) ~/git/shelter-database$ ./init_db.sh

(shelter-database-JZplA0Yt) ~/git/shelter-database$ python src/runserver.py
* Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

Read the [documentation](/documentation) for more  information about
the deployment of the application.

## Documentation

To generate the documentation in HTML format:

    ./documentation$ sudo pip install sphinx
    ./documentation$ make html

The result will be in the *_build* folder.


## License

This application is under MIT license.


## Contact

* https://github.com/rodekruis/shelter-database

Browser testing provided by -
[![BrowserStack](https://scottlogic.github.io/d3fc/images/browser-stack.svg)](https://browserstack.com)
