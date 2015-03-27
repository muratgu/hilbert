from random import randint
import hilbert


class TestEncoding():

    def test_decode_inverts_encode(self):
        n = randint(0, 10)
        d = randint(0, n)
        x, y = hilbert.d2xy(n, d)
        d2 = hilbert.xy2d(n, x, y)
        assert(d == d2)
