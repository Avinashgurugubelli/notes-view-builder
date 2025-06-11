from collections import defaultdict
import os
from pathlib import Path
import re
import json
import glob
from typing import List, Dict, cast

config = {
    "ignored_directories": ["node_modules", "exp", "tests"],
    "source_code_path": os.path.join("src", '**'),
    "output_file_path": os.path.join('build', 'output_file_path.json'),
    "file_extension": ".html"
}


def extract_numeric_prefix(name):
    # Match leading digits followed by _ or .
    match = re.match(r"^(\d+)[_.]", name)
    if match:
        return match.group(1)
    return None

def path_to_dict(path, idx=None, auto_id=[1]):
    base_name = os.path.basename(path)
    d = {'label': base_name}
    prefix = extract_numeric_prefix(base_name)
    if prefix:
        d['id'] = int(prefix)
    else:
        d['id'] = auto_id[0]
        auto_id[0] += 1
    if os.path.isdir(path):
        d['type'] = "directory"
        all_results = os.listdir(path)
        d['children'] = [
            path_to_dict(os.path.join(path, x), None, auto_id)
            for x in all_results
        ]
        # Sort children by id (as integer)
        d['children'].sort(key=lambda x: x['id'])
    else:
        d['type'] = "file"
        d['path'] = path.replace('\\', '/')
    return d


def generate_file_data():
    """
    Reads all the supression generates the report in json format
    """
    with open(str(config['output_file_path']), 'w') as outfile:
        json.dump(path_to_dict("src"), outfile)


if __name__ == '__main__':
    generate_file_data()
