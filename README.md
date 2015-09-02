Vitality
===

[Examples](https://github.com/slavahatnuke/vitalities)

The simplest lazy provisioner or health checker:

install: `npm install -g vitality`

ubuntu installation (vitality/node.js): 
- `which vitality || curl https://raw.githubusercontent.com/slavahatnuke/vitality/master/install/ubuntu.sh | sudo sh`

`vitality install.yml`

__install.yml__
```

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
[ok] mongo
[ok] mysql
[ok] mysql online

```

[Other Examples](https://github.com/slavahatnuke/vitalities)

