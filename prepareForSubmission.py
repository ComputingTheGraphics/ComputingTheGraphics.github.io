# !/usr/bin/python

import os
from collections import OrderedDict

pythonfile = __file__

def updatePostsMenu():
    # if the file is present in current directory,
    # then no need to specify the whole location
    fullpath = os.path.abspath(pythonfile)
    directoryOfFile = os.path.dirname(fullpath)

    postsMenu = OrderedDict()
    
    print('checking from _order.txt files')

    for root, dirs, files in os.walk(r'{}'.format(directoryOfFile)):
        if '/posts' not in root:
            continue
        
        index = (root[::-1]).index('/')
        currDir = root[-index:]
        orderFilepath = root + '/_order.txt'
        print('--- {}'.format(orderFilepath))
        if currDir == 'posts':
            # top level posts folder
            order = getOrderFromTxt(orderFilepath)
            confirmOrderIsValid(order, dirs, orderFilepath)
            for name in order:
                postsMenu[name] = []
        else:
            # sub level in posts folder
            order = getOrderFromTxt(orderFilepath)
            for name in order:
                postsMenu[currDir] = \
                    [name] if currDir not in postsMenu \
                    else postsMenu[currDir] + [name]

    print('\nFINAL POSTS MENU:')
    for key in postsMenu:
        print('{}'.format(key))
        for post in postsMenu[key]:
            print('\t{}'.format(post))

    # write to index.html file for the div - this can be iffy if the user still has this open.

def getOrderFromTxt(filepath):
    with open(filepath) as f:
        contents = f.read()
        contentsList = contents.split("\n")
        # remove blank lines
        return [item for item in contentsList if item != '']

def confirmOrderIsValid(orderedNames, names, orderFile):
    error = '''\
---- in file: {}
---- _order.txt does not have the same names as those found in the directory.
---- make sure to check spelling and capitalization when updating the txt list for your new post.
'''.format(orderFile)
    if len(orderedNames) != len(names):
        raise ValueError(error)
    else:
        for name in names:
            if name not in names:
                raise ValueError(error)

def addUserToContributorsFile():
    print('''\
We want to make sure all individuals are noted as contributors for computingthegraphics.com!

Are you already noted as a contributor? Do you not want your contributions to be known :( ?
You can skip this process.
''')
    valid = False
    while not valid:
        response = raw_input('>>>> WOULD YOU LIKE TO SKIP? TYPE ONE OF THE FOLLOWING (Y/N) : ')
        if response in ('Y', 'y', 'N', 'n', 'yes', 'YES', 'no', 'NO'):
            valid = True

    if response in ('Y', 'y', 'yes', 'YES'):
        return

    print('''\n\
You are added to the larger contributors file by your @githubHandle. Please note it below (case sensitive):''')
    
    valid = False
    while not valid:
        gitHandle = raw_input('>>>> @')
        response = raw_input('>>>> IS THIS THE HANDLE YOU WISH TO SAVE @{} (Y/N) : '.format(gitHandle))
        valid = response in ('Y', 'y', 'yes', 'YES')
   
    with open('CONTRIBUTORS.md', 'r+') as f:
        contents = f.read()
        contentsList = contents.split("\n")
        try:
            # Remove last empty line
            finalContentsList = contentsList[:-1]
        except:
            # This will only be thrown if the file was missing for some reason and auto created.
            pass
        if gitHandle in finalContentsList:
            print('''\
You were already noted as a contributor. Thanks for the engagement!!!

IF YOU THINK THIS IS A MISTAKE, NOTE IT AS AN ISSUE ON THE REPO OR IN THE DISCUSSION FORUM''')
        else:
            f.write('* [{}](https://github.com/{})\n'.format(gitHandle, gitHandle))
            print('''\
Your handle has now been added to our CONTRIBUTORS.md file. Thanks for the engagement!!!''')
            
        
    print('''\nTODOOOOOOOOOOOOOOO - add a way to confirm in the pull request that if the user changed the contributors.md file - that the username matches that of the name change''') 


# Ready for submit:
try:
    print("python run : {}".format(os.path.abspath(pythonfile)))
    print('''\n\
=========================
== UPDATING POSTS MENU ==
=========================\n''')
    updatePostsMenu()
    print('''\n\
===================================
== ADD USER TO CONTRIBUTORS FILE ==
===================================\n''')
    addUserToContributorsFile()
    print('''\n\
=====================================
== SUBMISSION READY FOR EDITORS :D ==
=====================================\n''')
except Exception as e:
    print(e)
    print('\n\n== Errored while running final submission tasks. ==')
    print('\n\n====== !!! SUBMISSION NOT READY TO BE REVIEWED BY EDITORS !!! ======\n\n')
