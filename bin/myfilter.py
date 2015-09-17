#!/usr/bin/env python
# encoding: utf-8

from pandocfilters import walk, stringify, Para
import re
import json
import sys


def purify(k, v, fmt, meta):
    """
    First Step: Remove nonsense from unoconv
    """
    if k == 'Span':
        return [stringify(v[1])]


inselection = False
def phaseSelection(k, v, fmt, meta):
    """
    Second Step: Foce on selection
    """
    global inselection
    if k == 'Para':
        if isinstance(v[0], dict):
            return []
        if v[0] == '%%kaishi%%':
            # print(v[0])
            if inselection:
                inselection = False
            else:
                inselection = True
            return []
    if not inselection:
        return []


countQ = 0
consA = ''
phaseA = False
consJSON = {'a': [], 'r': True, 'q': []}

# If consQ unit is completed 
consUnit = False

consQ = {'qNum': 0, 'qc': '', 'qa_1': '',
                 'qa_2': '', 'qa_3': '', 'qa_4': ''}

def phaseQA(k, v, fmt, meta):
    """
    Thrid Step: write formot JSON
    """
    global consJSON, consQ, consUnit, phaseA, consA

    if k == 'Para':
        if isinstance(v[0], dict):
            return []
        if re.search(u'.*答案.*[A-D]*', v[0]):
            # ZhengZhi's answer layout
            r = re.findall(u'[A-D]', v[0])
            consA = ''.join(r)
        elif re.search(u'(\s)*\d(\s)*[\.)。/|\"].*', v[0]):
            # It's question, may multi lines
            phaseA = False
            consUnit = False
            r = re.split(u'[\.)。/|\"]', v[0].strip())
            consQ['qNum'] = r[0].strip() + "."      # add delimiter
            r.pop(0)
            consQ['qc'] = ''.join(r).strip()
        elif re.search(u'(\s)*[A-D](\s)*[\.)。/|\"].*', v[0]):
            # It's answers, one at a time
            phaseA = True
            if re.search(u'(\s)*A(\s)*[\.)。/|"].*', v[0]):
                consQ['qa_1'] = v[0].strip()
            if re.search(u'(\s)*B(\s)*[\.)。/|"].*', v[0]):
                consQ['qa_2'] = v[0].strip()
            if re.search(u'(\s)*C(\s)*[\.)。/|"].*', v[0]):
                consQ['qa_3'] = v[0].strip()
            if re.search(u'(\s)*D(\s)*[\.)。/|"].*', v[0]):
                consQ['qa_4'] = v[0].strip()
        else:
            # Fallback if have multiline of question
            consUnit = False
            consQ['qc'] += v[0]
    if (consQ['qa_1'] and consQ['qa_2'] and consQ['qa_3'] and consQ['qa_4'] and consA):
        # If qa_[1-4] is fullfilled
        consJSON['q'].append(consQ)
        consJSON['a'].append(consA)
        consQ = {'qNum': 0, 'qc': '', 'qa_1': '',
                 'qa_2': '', 'qa_3': '', 'qa_4': ''}
        consA = ''
        phaseA = False


if __name__ == "__main__":
    file_c = open("out.json", "r")
    c = json.loads(file_c.read())
    purified = walk(c, purify, '', '')
    #purifiedJSON = json.dumps(altered, ensure_ascii=False)
    mySelections = walk(purified, phaseSelection, '', '')
    #selectionJSON = json.dumps(altered, mySelections, ensure_ascii=False)

    walk(mySelections, phaseQA, '', '')
    f = open('qa.json', 'w+')
    json.dump(consJSON, f, ensure_ascii=False)
