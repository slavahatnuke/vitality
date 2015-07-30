Vitality
===

The simplest lazy provisioner or health checker:

install: `npm install -g vitality`

`vitality install.yml`

__install.yml__
```

install vitality :
  if: which vitality
  else: npm install -g vitality

mongo:
  if:   which mongo
  else: sudo apt-get install -y mongodb

mysql:
  if:   which mysql
  else:
    - /bin/bash -c "sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'"
    - /bin/bash -c "sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'"
    - /bin/bash -c "sudo apt-get -y install mysql-server"

mysql online:
  if: ps aux | grep mysqld | grep /bin/mysql
  else: service mysql restart

```

result will be as

```
$ vitality install.yml
[ok] install vitality
[ok] mongo
[ok] mysql
[ok] mysql online

```

[Other Examples](https://github.com/slavahatnuke/vitalities)

