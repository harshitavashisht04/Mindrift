import { NodeData, LinkedListObjective, VerificationResult, VerificationMismatch } from '../types';

/**
 * Pure verification engine for validating Singly Linked Lists against educational objectives.
 * Operates purely locally with explicit diagnostics and actionable instructions.
 */
export function verifyLinkedList(
  currentNodes: NodeData[],
  objective: LinkedListObjective
): VerificationResult {
  const currentValues = currentNodes.map((n) => Number(n.value));
  const expectedValues = objective.targetList;
  const mismatches: VerificationMismatch[] = [];
  const errors: string[] = [];
  const recommendations: string[] = [];
  const missingItems: number[] = [];
  const unexpectedItems: number[] = [];

  // Check 1: Empty list check
  if (currentNodes.length === 0) {
    errors.push('The linked list is currently empty (HEAD points to NULL).');
    recommendations.push(
      `Begin by inserting the initial required node with value ${expectedValues[0] ?? 0} using 'Insert Head'.`
    );
  }

  // Check 2: Length validations
  if (objective.exactLength !== undefined && currentNodes.length !== objective.exactLength) {
    const diff = objective.exactLength - currentNodes.length;
    if (diff > 0) {
      errors.push(`Length mismatch: Found ${currentNodes.length} nodes, but expected exactly ${objective.exactLength} (needs ${diff} more).`);
      recommendations.push(`Use 'Insert Tail' or 'Insert at Index' to add ${diff} missing node(s).`);
    } else {
      errors.push(`Length mismatch: Found ${currentNodes.length} nodes, but expected exactly ${objective.exactLength} (has ${Math.abs(diff)} too many).`);
      recommendations.push(`Use 'Delete Tail' or delete extraneous nodes to reach ${objective.exactLength} nodes.`);
    }
  }

  if (objective.minLength !== undefined && currentNodes.length < objective.minLength) {
    errors.push(`Minimum length not met: Found ${currentNodes.length} nodes, requires at least ${objective.minLength}.`);
  }

  if (objective.maxLength !== undefined && currentNodes.length > objective.maxLength) {
    errors.push(`Maximum length exceeded: Found ${currentNodes.length} nodes, allows at most ${objective.maxLength}.`);
  }

  // Check 3: Duplicates
  if (!objective.allowDuplicates) {
    const seen = new Set<number>();
    const dupes = new Set<number>();
    for (const val of currentValues) {
      if (seen.has(val)) {
        dupes.add(val);
      }
      seen.add(val);
    }
    if (dupes.size > 0) {
      const dupeArr = Array.from(dupes);
      errors.push(`Duplicate values detected: [${dupeArr.join(', ')}]. This objective requires distinct values.`);
      recommendations.push(`Delete duplicate nodes matching ${dupeArr.join(', ')}.`);
    }
  }

  // Check 4: Must contain values
  const mustContain = objective.mustContain || expectedValues;
  for (const item of mustContain) {
    if (!currentValues.includes(item)) {
      missingItems.push(item);
    }
  }
  if (missingItems.length > 0) {
    errors.push(`Missing required objective value(s): [${missingItems.join(', ')}].`);
    recommendations.push(`Insert missing values [${missingItems.join(', ')}] into the appropriate positions.`);
  }

  // Check 5: Must NOT contain values
  if (objective.mustNotContain && objective.mustNotContain.length > 0) {
    for (const item of objective.mustNotContain) {
      if (currentValues.includes(item)) {
        unexpectedItems.push(item);
      }
    }
    if (unexpectedItems.length > 0) {
      errors.push(`Prohibited value(s) found in list: [${unexpectedItems.join(', ')}].`);
      recommendations.push(`Remove nodes containing [${unexpectedItems.join(', ')}].`);
    }
  }

  // Check 6: Element-by-element sequential verification
  const maxLen = Math.max(currentValues.length, expectedValues.length);
  for (let i = 0; i < maxLen; i++) {
    const actual = i < currentValues.length ? currentValues[i] : null;
    const expected = i < expectedValues.length ? expectedValues[i] : null;

    if (actual !== expected) {
      if (actual === null) {
        mismatches.push({
          index: i,
          expected,
          actual: null,
          message: `Position [${i}]: Node is missing. Expected value was ${expected}.`,
        });
      } else if (expected === null) {
        mismatches.push({
          index: i,
          expected: null,
          actual,
          message: `Position [${i}]: Unexpected extra node with value ${actual}.`,
        });
      } else {
        mismatches.push({
          index: i,
          expected,
          actual,
          message: `Position [${i}]: Value mismatch. Expected ${expected}, but found ${actual}.`,
        });
      }
    }
  }

  // Check 7: Sorted ordering check if objective requires it
  if (objective.mustBeSorted === 'asc') {
    for (let i = 0; i < currentValues.length - 1; i++) {
      if (currentValues[i] > currentValues[i + 1]) {
        errors.push(`Order error: List is not strictly ascending at indices ${i} and ${i + 1} (${currentValues[i]} > ${currentValues[i + 1]}).`);
        recommendations.push('Reorder or reverse the list so elements increase from HEAD to TAIL.');
        break;
      }
    }
  } else if (objective.mustBeSorted === 'desc') {
    for (let i = 0; i < currentValues.length - 1; i++) {
      if (currentValues[i] < currentValues[i + 1]) {
        errors.push(`Order error: List is not descending at indices ${i} and ${i + 1} (${currentValues[i]} < ${currentValues[i + 1]}).`);
        recommendations.push('Reorder elements so values decrease from HEAD to TAIL.');
        break;
      }
    }
  }

  const isValid = mismatches.length === 0 && errors.length === 0 && missingItems.length === 0 && unexpectedItems.length === 0;

  // Generate deterministic proof token if valid
  const proofToken = isValid
    ? `MND-LL-${objective.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    : undefined;

  return {
    isValid,
    verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    mode: 'local',
    objectiveId: objective.id,
    objectiveTitle: objective.title,
    scannedCount: currentNodes.length,
    expectedCount: expectedValues.length,
    mismatches,
    missingItems,
    unexpectedItems,
    errors,
    recommendations,
    proofToken,
  };
}

/**
 * Predefined educational objectives for Singly Linked Lists
 */
export const PRESET_OBJECTIVES: LinkedListObjective[] = [
  {
    id: 'obj-basic-seq',
    title: 'Construct Ascending Sequence',
    badge: 'Foundation',
    difficulty: 'Beginner',
    description: 'Construct a 4-node singly linked list containing numbers 10, 20, 30, and 40 in ascending order.',
    requirements: [
      'List must contain exactly 4 nodes',
      'Nodes must appear in order: 10 -> 20 -> 30 -> 40 -> NULL',
      'No duplicate values allowed',
      'HEAD must point to node with value 10'
    ],
    targetList: [10, 20, 30, 40],
    allowDuplicates: false,
    exactLength: 4,
    mustBeSorted: 'asc',
    initialPreset: [10, 30, 40],
    hint: 'Notice that 20 is missing from the list. Use "Insert at Index 1" with value 20.',
  },
  {
    id: 'obj-middle-insert',
    title: 'Middle Insertion Mastery',
    badge: 'Pointers',
    difficulty: 'Intermediate',
    description: 'Given an initial list [10, 20, 40, 50], insert the missing value 30 at index 2 without mutating other nodes.',
    requirements: [
      'List must contain exactly 5 nodes',
      'Nodes must appear in order: 10 -> 20 -> 30 -> 40 -> 50 -> NULL',
      'Must contain value 30 between 20 and 40',
      'Index 2 must hold value 30'
    ],
    targetList: [10, 20, 30, 40, 50],
    allowDuplicates: false,
    exactLength: 5,
    mustBeSorted: 'asc',
    initialPreset: [10, 20, 40, 50],
    hint: 'Select "Insert at Index", specify index 2 and value 30, then click Insert.',
  },
  {
    id: 'obj-remove-dupes',
    title: 'Purge Duplicate Nodes',
    badge: 'Cleanup',
    difficulty: 'Intermediate',
    description: 'Given a list with duplicate elements [5, 12, 12, 19, 24, 24], delete all extra occurrences so every value is unique.',
    requirements: [
      'List must contain exactly 4 nodes: 5 -> 12 -> 19 -> 24',
      'No value may appear more than once',
      'Maintain ascending sorted order'
    ],
    targetList: [5, 12, 19, 24],
    allowDuplicates: false,
    exactLength: 4,
    mustBeSorted: 'asc',
    initialPreset: [5, 12, 12, 19, 24, 24],
    hint: 'Locate redundant nodes and use "Delete by Value" or delete at their specific indices.',
  },
  {
    id: 'obj-reverse-list',
    title: 'Reverse Singly Linked List',
    badge: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Given the list [1, 2, 3, 4, 5], reverse all node pointers so the resulting list is [5, 4, 3, 2, 1].',
    requirements: [
      'HEAD must point to 5',
      'Nodes must chain: 5 -> 4 -> 3 -> 2 -> 1 -> NULL',
      'Length must remain exactly 5'
    ],
    targetList: [5, 4, 3, 2, 1],
    allowDuplicates: false,
    exactLength: 5,
    mustBeSorted: 'desc',
    initialPreset: [1, 2, 3, 4, 5],
    hint: 'You can use the built-in "Reverse List" operation or reconstruct the list by repeatedly inserting at Head.',
  },
  {
    id: 'obj-tail-append',
    title: 'Tail Append & Pointer Retarget',
    badge: 'Pointers',
    difficulty: 'Beginner',
    description: 'Construct [7, 14, 21, 28] by appending 28 to the current 3-node list.',
    requirements: [
      'List must finish with value 28 pointing to NULL',
      'List must have length 4: [7, 14, 21, 28]'
    ],
    targetList: [7, 14, 21, 28],
    allowDuplicates: false,
    exactLength: 4,
    mustBeSorted: 'asc',
    initialPreset: [7, 14, 21],
    hint: 'Enter value 28 and click "Insert Tail".',
  },
];
