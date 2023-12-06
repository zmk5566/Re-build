import os

# Specify the directory you want to start from
rootDir = '.'  # Change this path to your specific directory

for dirName, subdirList, fileList in os.walk(rootDir):
    for fname in fileList:
        if ' ' in fname: 
            src = os.path.join(dirName, fname)
            dst = os.path.join(dirName, fname.replace(' ', '_'))
            os.rename(src, dst) # rename the file
