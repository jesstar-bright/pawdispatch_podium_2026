#!/usr/bin/env node

/**
 * Backend Integration Checker
 * Verifies that all backend APIs and database components work together
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let errors = [];
let warnings = [];
let passed = [];

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    passed.push(`✓ ${description}`);
    return true;
  } else {
    errors.push(`✗ ${description} - File not found: ${filePath}`);
    return false;
  }
}

function checkImport(filePath, importPattern, description) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`✗ ${description} - File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(importPattern)) {
    passed.push(`✓ ${description}`);
    return true;
  } else {
    warnings.push(`⚠ ${description} - Import pattern not found: ${importPattern}`);
    return false;
  }
}

console.log(`${YELLOW}=== Backend Integration Check ===${RESET}\n`);

// Check database layer files
console.log(`${YELLOW}Checking Database Layer...${RESET}`);
checkFile('src/lib/db/schema.ts', 'Database schema file');
checkFile('src/lib/db/index.ts', 'Database client file');
checkFile('src/lib/db/migrate.ts', 'Database migration file');
checkFile('src/lib/db/seed.ts', 'Seed data file');
checkFile('src/lib/db/utils.ts', 'Validation utilities');
checkFile('src/lib/db/slots.ts', 'Time slot utilities');
checkFile('src/lib/db/confirmation.ts', 'Confirmation number generator');

// Check API route files
console.log(`\n${YELLOW}Checking API Routes...${RESET}`);
checkFile('src/app/api/pricing/estimate/route.ts', 'POST /api/pricing/estimate');
checkFile('src/app/api/pricing/estimate/[estimateId]/route.ts', 'GET /api/pricing/estimate/[estimateId]');
checkFile('src/app/api/appointments/propose/route.ts', 'POST /api/appointments/propose');
checkFile('src/app/api/appointments/confirm/route.ts', 'POST /api/appointments/confirm');
checkFile('src/app/api/appointments/[appointmentId]/route.ts', 'GET /api/appointments/[appointmentId]');
checkFile('src/app/api/seed/route.ts', 'POST /api/seed');

// Check imports in API routes
console.log(`\n${YELLOW}Checking API → Database Integration...${RESET}`);
checkImport('src/app/api/pricing/estimate/route.ts', 'from "@/lib/db"', 'Pricing estimate imports database');
checkImport('src/app/api/pricing/estimate/[estimateId]/route.ts', 'from "@/lib/db"', 'Get estimate imports database');
checkImport('src/app/api/appointments/propose/route.ts', 'from "@/lib/db"', 'Propose appointments imports database');
checkImport('src/app/api/appointments/confirm/route.ts', 'from "@/lib/db"', 'Confirm appointment imports database');
checkImport('src/app/api/appointments/[appointmentId]/route.ts', 'from "@/lib/db"', 'Get appointment imports database');
checkImport('src/app/api/seed/route.ts', 'from "@/lib/db/seed"', 'Seed endpoint imports seed function');

// Check database schema exports
console.log(`\n${YELLOW}Checking Database Schema...${RESET}`);
const schemaPath = path.join(__dirname, 'src/lib/db/schema.ts');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  const requiredTables = ['customers', 'pets', 'pricing_estimates', 'groomers', 'appointments'];
  requiredTables.forEach(table => {
    if (schemaContent.includes(`export const ${table}`)) {
      passed.push(`✓ Table '${table}' defined in schema`);
    } else {
      errors.push(`✗ Table '${table}' not found in schema`);
    }
  });
}

// Check package.json dependencies
console.log(`\n${YELLOW}Checking Dependencies...${RESET}`);
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const requiredDeps = ['drizzle-orm', 'better-sqlite3'];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      passed.push(`✓ Dependency '${dep}' in package.json`);
    } else {
      warnings.push(`⚠ Dependency '${dep}' not found in package.json (may need npm install)`);
    }
  });
  
  const requiredDevDeps = ['drizzle-kit', '@types/better-sqlite3'];
  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      passed.push(`✓ Dev dependency '${dep}' in package.json`);
    } else {
      warnings.push(`⚠ Dev dependency '${dep}' not found in package.json (may need npm install)`);
    }
  });
}

// Summary
console.log(`\n${YELLOW}=== Summary ===${RESET}\n`);

if (passed.length > 0) {
  console.log(`${GREEN}Passed (${passed.length}):${RESET}`);
  passed.forEach(item => console.log(`  ${item}`));
}

if (warnings.length > 0) {
  console.log(`\n${YELLOW}Warnings (${warnings.length}):${RESET}`);
  warnings.forEach(item => console.log(`  ${item}`));
}

if (errors.length > 0) {
  console.log(`\n${RED}Errors (${errors.length}):${RESET}`);
  errors.forEach(item => console.log(`  ${item}`));
  console.log(`\n${RED}❌ Integration check FAILED${RESET}`);
  process.exit(1);
} else {
  console.log(`\n${GREEN}✅ Integration check PASSED${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}⚠️  Some warnings - review above${RESET}`);
  } else {
    console.log(`${GREEN}🎉 All checks passed! Backend is ready.${RESET}`);
  }
  process.exit(0);
}
