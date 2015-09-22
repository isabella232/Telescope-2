# Telescope
AdmitHub's telescope implementation

1. Clone the repo
2. Delete the admithub-common repo and clone it again within packages directory. 
3. Switch admithub common to the branch references in telescope (3549c70 as of 9/22)
4. Add the following to the usertags db using db.usertags.insert({}); in mongo console


{
    "_id" : "H3bWJFw77wCzRjj5S",
    "name" : "Educator",
    "slug" : "educator"
}


{
    "_id" : "WDeuh4Cxroit663pu",
    "name" : "Parent",
    "slug" : "parent"
}


{
    "_id" : "r75JhEbvgLrey7TvF",
    "name" : "Student",
    "slug" : "student"
}
