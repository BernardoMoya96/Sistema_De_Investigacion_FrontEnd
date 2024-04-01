import * as bdd from 'intern!bdd';
import { map } from 'lodash';
import { flatten } from '../../un-flatten-tree';
import * as expect from 'intern/chai!expect';
import Node from './Node';

bdd.describe('flatten', () => {
    bdd.it('should convert an empty array to an empty array', function () {
        expect(flatten([], () => [])).to.eql([]);
    });

    bdd.it('should convert tree to list', () => {
        const tree = [
            {l: 1, i: [
                {l: 5}
            ]},
            {l: 2, i: [
                {l: 6, i: []}
            ]},
            {l: 3, i: [
                {l: 7, i: [
                    {l: 8, i: null},
                    {l: 9, i: [
                        {l: 11, i: []}
                    ]},
                    {l: 10, i: []}
                ]}
            ]},
            {l: 4, i: undefined}
        ];

        const list = [
            {l: 1, i: [
                {l: 5}
            ]},
            {l: 5},
            {l: 2, i: [
                {l: 6, i: []}
            ]},
            {l: 6, i: []},
            {l: 3, i: [
                {l: 7, i: [
                    {l: 8, i: null},
                    {l: 9, i: [
                        {l: 11, i: []}
                    ]},
                    {l: 10, i: []}
                ]}
            ]},
            {l: 7, i: [
                {l: 8, i: null},
                {l: 9, i: [
                    {l: 11, i: []}
                ]},
                {l: 10, i: []}
            ]},
            {l: 8, i: null},
            {l: 9, i: [
                {l: 11, i: []}
            ]},
            {l: 11, i: []},
            {l: 10, i: []},
            {l: 4, i: undefined}
        ];

        expect(flatten(tree, node => node.i as any)).to.eql(list);
    });

    bdd.it('should convert tree to list of nodes with parent ids', () => {
        const tree = [
            {id: 1, items: []},
            {id: 2, items: [
                {id: 4, items: [
                    {id: 5, items: [
                        {id: 7, items: []}
                    ]},
                    {id: 6, items: []}
                ]}
            ]},
            {id: 3, items: [
                {id: 8, items: []}
            ]}
        ];

        const list = [
            {id: 1, pid: null},
            {id: 2, pid: null},
            {id: 4, pid: 2},
            {id: 5, pid: 4},
            {id: 7, pid: 5},
            {id: 6, pid: 4},
            {id: 3, pid: null},
            {id: 8, pid: 3}
        ];

        expect(
            flatten(
                tree,
                (node) => node.items,
                (node, parentNode) => ({
                    id: node.id,
                    pid: parentNode !== undefined ? parentNode.id : null
                })
            )
        ).to.eql(list);
    });

    bdd.it('should convert tree of node objects to list of node names', () => {
        const tree = [new Node('A',[
            new Node('B'),
            new Node('C', [
                new Node('D')
            ]),
            new Node('E', [
                new Node('F', [
                    new Node('G'),
                    new Node('H')
                ])
            ])
        ])];

        const list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        expect(
            flatten(
                tree,
                node => node.getChildren(),
                node => node.getName()
            )
        ).to.eql(list);
    });

    bdd.it('should convert tree to list with generated parent ids', () => {
        const tree = [
            {name: 'A', items: [
                {name: 'A'},
                {name: 'B'},
                {name: 'C'}
            ]},
            {name: 'B', items: [
                {name: 'A', items: []}
            ]}
        ];

        const list = [
            {name: 'A', id: 1, pid: undefined},
            {name: 'A', id: 2, pid: 1},
            {name: 'B', id: 3, pid: 1},
            {name: 'C', id: 4, pid: 1},
            {name: 'B', id: 5, pid: undefined},
            {name: 'A', id: 6, pid: 5}
        ];

        let cnt = 1;

        expect(
            flatten(
                tree,
                node => node.items as any,
                (node, parentNode, nodeId, parentId) => ({
                    name: node.name,
                    id: nodeId,
                    pid: parentId
                }),
                () => cnt++
            )
        ).to.eql(list);
    });

    bdd.it('should convert array-like object tree to list', () => {
        const tree = {
            0: {name: 'A', items: {
                0: {name: 'B'},
                1: {name: 'C'},
                2: {name: 'D'},
                length: 3
            }},
            1: {name: 'E', items: {
                0: {name: 'F', items: { length: 0 }},
                length: 1
            }},
            length: 2
        };

        const list = [
            {name: 'A'},
            {name: 'B'},
            {name: 'C'},
            {name: 'D'},
            {name: 'E'},
            {name: 'F'}
        ];

        expect(
            flatten(
                tree,
                node => node.items as any,
                node => ({ name: node.name })
            )
        ).to.eql(list);
    });

    // test case taken from here - http://stackoverflow.com/q/23919887/4134913
    bdd.it('should convert tree to list of "routes"', function () {
        const tree = {
            f: {
                t: '100',
                f: {
                    i: ['150'],
                    b: ['300'],
                    f: {
                        k: 100
                    }
                },
                'l': ['255']
            },
            'c': {
                's': {
                    't': ['100']
                },
                't': '100'
            }
        };

        const list = ['ft', 'ffi', 'ffb', 'fffk', 'fl', 'cst', 'ct'];

        const walk = t => map(t, (v, k) => ({
            name: k,
            items: (typeof v !== 'object' || v instanceof Array) ? [] : walk(v)
        }));

        const getChildNodes = node => node.items.map(item => ({
            name: node.name + item.name,
            items: item.items
        }));

        expect(
            flatten(walk(tree), getChildNodes)
                .filter(node => (node as any).items.length === 0)
                .map(node => (node as any).name)
        ).to.eql(list);
    });

    bdd.it('should convert deeply nested tree to list', () => {
        const tree = {id: 0, items: []};
        const list = [0];
        let treeHead = tree;

        for (let i = 1; i <= 100000; i++) {
            treeHead.items.push({id: i, items: []});
            treeHead = treeHead.items[0];

            list.push(i);
        }

        expect(
            flatten(
                [tree],
                node => node.items,
                node => node.id
            )
        ).to.eql(list);
    });
});
