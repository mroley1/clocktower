import { version } from 'os';
import Version from './Version';

test('default', () => {
    let v = new Version(null)
    expect(v.value()).toBe("v1.0.0");
});

test('version normal 2.0 w/ sub', () => {
    let v = new Version("v2.0.0b")
    expect(v.value()).toBe("v2.0.0b");
});

test('version normal', () => {
    let v = new Version("v6.5.4")
    expect(v.value()).toBe("v6.5.4");
});

test('version subversion', () => {
    let v = new Version("v2.3.4a")
    expect(v.value()).toBe("v2.3.4a");
});

test('less than major', () => {
    let v = new Version("v1.3.4")
    let b = new Version("v2.3.4")
    expect(v < b).toBeTruthy()
});

test('less than middle', () => {
    let v = new Version("v2.2.4")
    let b = new Version("v2.3.4")
    expect(v < b).toBeTruthy()
});

test('less than minor', () => {
    let v = new Version("v2.3.3")
    let b = new Version("v2.3.4")
    expect(v < b).toBeTruthy()
});

test('less than sub', () => {
    let v = new Version("v2.3.4a")
    let b = new Version("v2.3.4b")
    expect(v < b).toBeTruthy()
});

test('less than tricky', () => {
    let v = new Version("v3.76.4vt")
    let b = new Version("v12.3g.4")
    expect(v < b).toBeTruthy()
});

test('greater than major', () => {
    let v = new Version("v1.3.4")
    let b = new Version("v2.3.4")
    expect(b > v).toBeTruthy()
});

test('greater than middle', () => {
    let v = new Version("v2.2.4")
    let b = new Version("v2.3.4")
    expect(b > v).toBeTruthy()
});

test('greater than minor', () => {
    let v = new Version("v2.3.3")
    let b = new Version("v2.3.4")
    expect(b > v).toBeTruthy()
});

test('greater than sub', () => {
    let v = new Version("v2.3.4a")
    let b = new Version("v2.3.4b")
    expect(b > v).toBeTruthy()
});

test('greater than tricky', () => {
    let v = new Version("v3.76.4vt")
    let b = new Version("v12.3g.4")
    expect(b > v).toBeTruthy()
});

test('equal to major', () => {
    let v = new Version("v2.3.4")
    let b = new Version("v2.3.4")
    expect(v.equals(b)).toBeTruthy()
});

test('equal to middle', () => {
    let v = new Version("v2.3.4")
    let b = new Version("v2.3.4")
    expect(v.equals(b)).toBeTruthy()
});

test('equal to minor', () => {
    let v = new Version("v2.3.4")
    let b = new Version("v2.3.4")
    expect(v.equals(b)).toBeTruthy()
});

test('equal to sub', () => {
    let v = new Version("v2.3.4a")
    let b = new Version("v2.3.4a")
    expect(v.equals(b)).toBeTruthy()
});

test('equal to tricky', () => {
    let v = new Version("v3.76.4vt")
    let b = new Version("v3.76.4vt")
    expect(v.equals(b)).toBeTruthy()
});

test('sort by version', () => {
    const array = [
        new Version("v2.0.0"),
        new Version(null),
        new Version("v14.3.1a"),
        new Version("v4.2.19"),
        new Version("v14.3.1"),
        new Version("v12.0.0"),
        new Version("v120.0.0"),
        new Version("v4.3.19"),
        new Version("v14.3.1b"),
        new Version("v4.2.22")
    ];
    const sortedArray = array.toSorted();
    const actual = sortedArray.map((a) => a.value())
    const expected = ["v1.0.0", "v2.0.0", "v4.2.19", "v4.2.22", "v4.3.19", "v12.0.0", "v14.3.1", "v14.3.1a", "v14.3.1b", "v120.0.0"]
    expect(actual).toEqual(expect.arrayContaining(expected))
});
