# Telescope
AdmitHub's telescope implementation

## getting started
1. Clone the repo
2. `$ git submodule init && git submodule update`
3. `$ meteor`
4. Add the following to the usertags and categories db via the meteor mongo console (start the console with `meteor mongo`)

```
$ db.usertags.insert({"_id" : "H3bWJFw77wCzRjj5S", "name" : "Educator", "slug" : "educator"})

$ db.usertags.insert({"_id" : "WDeuh4Cxroit663pu", "name": "Parent", "slug" : "parent"})

$ db.usertags.insert({"_id" : "r75JhEbvgLrey7TvF", "name" : "Student", "slug" : "student"})

$ db.categories.insert({"_id": "4ZG9s6XWNesvbtQbx", "name": "International", "order": 1, "slug" : "international"});

$ db.categories.insert({"_id" : "65TWpCqWjqjDNhawv","name" : "Counselors", "order" : 1, "slug" : "counselors"});

$ db.categories.insert({"_id" : "FFNPzSEwXJRrhcLzw","name" : "Ivy League", "order" : 1, "slug" : "ivy-league"});
```


### development
- run `$ meteor`
