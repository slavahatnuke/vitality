Vitality
===

The simplest lazy provisioner:



`vitality install.yml`

__install.yml__
```

install vitality :
  if: which vitality
  else: npm install -g vitality


```

