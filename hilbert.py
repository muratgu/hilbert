"""
Hilbert curve generator. Non-recursive.
"""


def _rot(n, x, y, rx, ry):
    if ry == 0:
        if rx == 1:
            x = n - 1 - x
            y = n - 1 - y
        return y, x
    return x, y


def gen(level):
    """
    Generates a list of hilbert curve tuples
    for a 2D space in given size.

    Params:
        level (int): level of iteration.
                the size of the grid will be
                2**level.

    Returns:
        list of x,y coordinate tuples
    """
    n = (1 << level)
    return [d2xy(level, d) for d in range(0, n)]


def xy2d(level, x, y):
    """
    Calculates the 1D distance of a point
    to the origin on a 2D hilbert curve.

    Params:
        level (int): level of iteration.
                the size of the grid will be
                2**level.
        x (int): x coordinate
        y (int): y coordinate

    Returns:
        (int): distance to origin

    """
    n = (1 << level)
    d = 0
    s = n / 2
    while s > 0:
        rx = 1 if (x & s) > 0 else 0
        ry = 1 if (y & s) > 0 else 0
        d += s * s * ((3 * rx) ^ ry)
        x, y = _rot(s, x, y, rx, ry)
        s = s / 2
    return d


def d2xy(level, d):
    """
    Calculates the coordinate of a point
    on 2D hilbert curve which is a distance
    away from the origin.

    Params:
        level (int): level of iteration.
                the size of the grid will be
                2**level.
        d (int): distance to the origin

    Returns:
        (int, int): xy coordinate

    """
    n = (1 << level)
    t = d
    s = 1
    x, y = 0, 0
    while s < n:
        rx = 1 & (t / 2)
        ry = 1 & (t ^ rx)
        x, y = _rot(s, x, y, rx, ry)
        x += s * rx
        y += s * ry
        t /= 4
        s *= 2
    return x, y
