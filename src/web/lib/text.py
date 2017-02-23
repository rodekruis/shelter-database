import re
from unicodedata import normalize

_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')


def slugify(text, delim="_"):
    """Generates an slightly worse ASCII-only slug."""
    result = []
    for word in _punct_re.split(text.lower()):
        word = normalize('NFKD', word)
        if word:
            result.append(word)
    return str(delim.join(result))
