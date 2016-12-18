#LoopcakeServer Changelog

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

_**Changes are not tested, yet.**_

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
