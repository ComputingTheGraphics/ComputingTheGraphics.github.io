# !/usr/bin/python

import os
from collections import OrderedDict

def updatePostsMenu():
    pythonfile = __file__

    # if the file is present in current directory,
    # then no need to specify the whole location
    fullpath = os.path.abspath(pythonfile)
    directoryOfFile = os.path.dirname(fullpath)
    print("Path of the file..", os.path.abspath(pythonfile))

    postsMenu = OrderedDict()

    for root, dirs, files in os.walk(r'{}'.format(directoryOfFile)):
        if '/posts' not in root:
            continue
        
        print('root is: {}'.format(root))
        print('-- dirs is : {}'.format(dirs))
        print('-- files is : {}'.format(files))

        index = (root[::-1]).index('/')
        currDir = root[-index:]
        if currDir == 'posts':
            print('------ A')
            # top level posts folder
            order = getOrderFromTxt(root + '/_order.txt')
            confirmOrderIsValid(order, dirs, root + '/_order.txt')
        else:
            print('------ B')
            # sub level in posts folder
            print('root + /_order.txt is : {}'.format(root + '/_order.txt'))
            order = getOrderFromTxt(root + '/_order.txt')
            print('order is : {}'.format(order))
            for name in order:
                postsMenu[currDir] = \
                    [name] if currDir not in postsMenu \
                    else postsMenu[currDir] + [name]
            print('---- postsMenu[{}] = {}'.format(currDir, postsMenu[currDir]))

def getOrderFromTxt(filepath):
    print('getting order from _order.txt')
    with open(filepath) as f:
        contents = f.read()
        contentsList = contents.split("\n")
        # remove blank lines
        return [item for item in contentsList if item != '']

def confirmOrderIsValid(orderedNames, names, orderFile):
    print('confirm _order.txt is valid for directory')
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

def addUserToContributersFile():
    # TODO - grab github username from local command line
    print('add user to contributers file')

# Ready for submit:
try:
    updatePostsMenu()
    addUserToContributersFile()
    print('SUBMISSION READY FOR EDITORS')
except Exception as e:
    print(e)
    print('\n\n== Errored while running final submission tasks. Make sure you ...... etc etc. ==')
    print('\n\n====== SUBMISSION NOT READY TO BE REVIEWED BY EDITORS ======\n\n')
