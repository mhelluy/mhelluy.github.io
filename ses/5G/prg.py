#!/usr/bin/env python3
name = input("Name : ")
with open("fichierlol","r") as fichier:
    reponses = fichier.read().split("\n")
for i,x in enumerate([y for y in reponses if y!=""]):
    print("<td><label for='{0}'>{1}</label><br/><input type='radio' id='{0}' name='{2}'/></td>".format(str(i) + name, x, name))