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


def gen (n):
    """
    Generates a list of hilbert curve tuples
    for a 2D space in given size.

    Params:
        n (int): size of the 2D space

    Returns:
        list of x,y coordinate tuples
    """
    return [d2xy(n, d) for d in range(0, 2**n)]


def xy2d (n, x, y):
    """
    Calculates the 1D distance of a point
    to the origin on a 2D hilbert curve.

    Params:
        n (int): size of the 2D space
        x (int): x coordinate
        y (int): y coordinate

    Returns:
        (int): distance to origin

    """
    d = 0
    s = n / 2
    while s > 0:
        rx = 1 if (x & s) > 0 else 0
        ry = 1 if (y & s) > 0 else 0
        d += s * s * ((3 * rx) ^ ry)
        x, y = _rot(s, x, y, rx, ry)    
        s = s / 2
    return d


def d2xy(n, d):
    """
    Calculates the coordinate of a point
    on 2D hilbert curve which is a distance
    away from the origin.

    Params:
        n (int): size of the 2D space
        d (int): distance to the origin

    Returns:
        (int, int): xy coordinate

    """
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

if __name__ == "__main__":
    p = gen(4)
    print len(p)
    print p
    print [xy2d(4, x[0], x[1]) for x in p]