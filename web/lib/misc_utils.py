

import sys
import subprocess


from weasyprint import HTML
HTML('http://weasyprint.org/').write_pdf('/tmp/weasyprint-website.pdf')

import conf

def launch_background_process(parameters=[]):
    """
    Fetch the feeds in a new processus.
    The "asyncio" crawler is launched with the manager.
    """
    cmd = [sys.executable, conf.BASE_DIR + '/manager.py']
    cmd.extend(parameters)
    return subprocess.Popen(cmd, stdout=subprocess.PIPE)

def create_pdf(html_code):
    """
    """
    pdf_file = HTML(string=html_code).write_pdf()
    return pdf_file
