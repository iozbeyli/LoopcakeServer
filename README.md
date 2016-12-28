#LoopcakeServer Changelog

---
##28 December 2016  15:30

####Changes:


+ Get user's course operation option is added.
  - **"/getCourse"** Send **operation: "3"**, operation returns user's attended courses. User should be logged in.


+ Get student's groups operation option is added for getGroup request. (Operation 4) User should be logged in.
  - **"/getCourse"** Send **operation: "4"**, operation returns user's membered groups. User should be logged in.


+ **Major change:** From now on, any repository creation should be requested with the body that contain **members _(body.members)_** of the repository.


+ Group repository creation is available now. Add request is /addRepo with request body consist of isRepoPersonal=false option. User should be logged in.
  - **"/addRepo"** set **isRepoPersonal=false**, and create the repo as usual.
  - **Note:** Adding/Removing a person from group repository is not implemented, yet.


+ Adding group repository as attachment to the submission of group operation is added.
  - **"/submitRepo"** Send **submissionid, repo (repository ID), groupname**. Operation creates a repository for group members and associates the newly created repository with the group on DB. User should be logged in, the deadline should not be expired.


+ **Minor Change:** From now on, /getAnnouncement **operation 1** return course names with the announcements.

+ Disk optimization for reading bulk student list from xlsx.

+ GroupSchema is updated. _(Added: course, checklist.point)_

+ /getGroup, /getCourse request operation check is updated.

+ Authentication check is removed temporarily from /university request for adding university.

+ Some other bug fixes

---
##11 December 2016   03:15

####Changes:

+ Edit Repository on DB
  - **"/editRepo"** Send **repoid**, and the intended variables **(name, members, details, tags)**, operation updates the entry, and returns its new form.


+ Edit Project on DB
  - **"/editProject"** Send **projectid**, and the intended variables **(name, maxGroupSize, details, tags, deadline)**, operation updates the entry, and returns its new form.


+ Edit Group and Its Student List on DB
  - **"/editGroup"** Send **groupid**, and the intended variables **(name, maxGroupSize, details, tags, students)**, operation updates the entry, and returns its new form.
  - **Important:** The students array that you send when updating the group, overwrites the old students array. So, send the whole student array when adding/removing people. i.e. When you add new person, send a students array that contains all the students (olds and the new guy) that are related to that group. Same goes with removing someone.
  - **Note:** Adding/Removing a person from group repository is not implemented, since we don't have group repository system, yet.


+ Add Attachment to Project Description
  - **"/upload"** Send **projectid** with **operation: "3"** mode, and send a file as usual, operation adds the attachment, and returns the updated project entry. Then, you can download attachment by sending GET request to _/download_ with {\_id: attachmentid}.


+ Remove Attachment from Project Description
  - **"/remove"** Send **projectid, attachmentid** with **operation: "1"** mode, operation removes the attachment, and returns the updated project entry.

~~Changes are not tested, yet.~~  **TESTED**

---
##09 December 2016   20:20

####Changes:

+ Creating projects.
+ Listing Projects of a Course.
+ Getting a project.
+ Creating a Group.
+ Finding Students Without a Group.
+ Listing Groups of a Project.
+ Getting a Group.
+ Getting Active User's Group.
+ Edit Course.

____
@author: mebegu
