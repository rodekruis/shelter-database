

import sys
import subprocess

import conf

def launch_background_process(parameters=[]):
    """
    Fetch the feeds in a new processus.
    The "asyncio" crawler is launched with the manager.
    """
    cmd = [sys.executable, conf.BASE_DIR + '/manager.py']
    cmd.extend(parameters)
    return subprocess.Popen(cmd, stdout=subprocess.PIPE)
