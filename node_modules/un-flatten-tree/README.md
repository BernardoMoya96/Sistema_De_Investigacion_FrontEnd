un-flatten-tree
=========
[![npm version](https://badge.fury.io/js/un-flatten-tree.svg?t=1495378566925)](https://badge.fury.io/js/un-flatten-tree)
[![Build Status](https://travis-ci.org/iyegoroff/un-flatten-tree.svg?t=1495378566925&branch=master)](https://travis-ci.org/iyegoroff/un-flatten-tree)
[![Coverage Status](https://coveralls.io/repos/github/iyegoroff/un-flatten-tree/badge.svg?t=1495378566925&branch=master)](https://coveralls.io/github/iyegoroff/un-flatten-tree?branch=master)
[![Dependency Status](https://david-dm.org/iyegoroff/un-flatten-tree.svg?t=1495378566925)](https://david-dm.org/iyegoroff/un-flatten-tree)
[![devDependency Status](https://david-dm.org/iyegoroff/un-flatten-tree/dev-status.svg?t=1495378566925)](https://david-dm.org/iyegoroff/un-flatten-tree#info=devDependencies)
[![typings included](https://img.shields.io/badge/typings-included-brightgreen.svg?t=1495378566925)](#typescript)
[![npm](https://img.shields.io/npm/l/express.svg?t=1495378566925)](https://www.npmjs.com/package/un-flatten-tree)

[![Build Status](https://saucelabs.com/browser-matrix/iyegoroff-2.svg?t=1495378566925)](https://saucelabs.com/beta/builds/e59549995d6e4497884003c6c8c1e129)

A small module for converting trees to lists and vice versa. Can be used in browser and Node.

## Installation

```bash
$ npm i un-flatten-tree
```

## Usage

#### flatten
Converts tree to list.

```javascript
var uft = require('un-flatten-tree');

var tree = [
    {name: 'A', items: [
        {name: 'B'},
        {name: 'C'}
    ]},
    {name: 'D', items: [
        {name: 'E', items: []}
    ]}
];

var list = uft.flatten(
    tree,
    node => node.items, // obtain child nodes
    node => node.name   // create output node
);
```
  
`list` should be `['A', 'B', 'C', 'D', 'E']`

#### unflatten
Converts list to tree.

```javascript
var uft = require('un-flatten-tree');

var list = [
    {id: 1, pid: null},
    {id: 2, pid: null},
    {id: 3, pid: 2},
    {id: 4, pid: 3},
    {id: 5, pid: 4}
];

var tree = uft.unflatten(
    list,
    (node, parentNode) => node.pid === parentNode.id,  // check if node is a child of parentNode
    (node, parentNode) => parentNode.items.push(node), // add node to parentNode
    node => ({id: node.id, items: []})                 // create output node
);
```
    
`tree` should be
  
```javascript
[
    {id: 1, items: []}, 
    {id: 2, items: [
        {id: 3, items: [
            {id: 4, items: [
                {id: 5, items: []}
            ]}
        ]}
    ]}
]
```
    
More complex examples of usage can be found in `tests` folder.

### Typescript

This module also contains type declarations.

```typescript
import * as uft from 'un-flatten-tree';

// or

import { unflatten, flatten } from 'un-flatten-tree';
```    
