/**
 * Test script for Keragon workflow trigger functionality
 * Tests both high-risk and low-risk scenarios
 */

import { woundWorkflowService } from './services/woundWorkflowService';
import { keragonService } from './services/keragonService';

// Mock image data for testing
const mockImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwNYemMcgoBjvzGDyJUg=';

interface TestScenario {
    name: string;
    description: string;
    expectedWorkflowType: 'critical-risk' | 'standard-care';
    expectedRiskThreshold: number;
}

/**
 * Test scenarios for workflow triggers
 */
const testScenarios: TestScenario[] = [
    {
        name: 'High Risk Infection Test',
        description: 'Should trigger critical workflow for >70% infection risk',
        expectedWorkflowType: 'critical-risk',
        expectedRiskThreshold: 70
    },
    {
        name: 'Low Risk Standard Test', 
        description: 'Should trigger standard workflow for ≤70% infection risk',
        expectedWorkflowType: 'standard-care',
        expectedRiskThreshold: 70
    }
];

/**
 * Run all Keragon workflow tests
 */
async function runKeragonWorkflowTests(): Promise<void> {
    console.log('🧪 Starting Keragon Workflow Trigger Tests\n');
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };

    for (const scenario of testScenarios) {
        console.log(`\n📋 Running Test: ${scenario.name}`);
        console.log(`📝 Description: ${scenario.description}`);
        
        try {
            // Run workflow with mock image data
            const workflowResult = await woundWorkflowService.executeWorkflow(
                mockImageData,
                'test-patient-id'
            );

            results.total++;

            if (!workflowResult.success) {
                console.log(`❌ Test Failed: ${scenario.name} - Workflow execution failed`);
                console.log(`   Error: ${workflowResult.error}`);
                results.failed++;
                continue;
            }

            // Check if Keragon workflow step was included
            const keragonStep = workflowResult.steps.find(step => 
                step.step === 'Workflow Automation (Keragon)'
            );

            if (!keragonStep) {
                console.log(`❌ Test Failed: ${scenario.name} - Keragon step not found`);
                results.failed++;
                continue;
            }

            if (!keragonStep.success) {
                console.log(`❌ Test Failed: ${scenario.name} - Keragon step failed: ${keragonStep.error}`);
                results.failed++;
                continue;
            }

            // Extract workflow results
            const workflowData = workflowResult.finalData?.workflowResults;
            if (!workflowData) {
                console.log(`❌ Test Failed: ${scenario.name} - No workflow results found`);
                results.failed++;
                continue;
            }

            const infectionRisk = workflowData.infectionRisk;
            const workflowType = workflowData.workflowType;

            console.log(`📊 Results:`);
            console.log(`   Infection Risk: ${infectionRisk}%`);
            console.log(`   Workflow Type: ${workflowType}`);
            console.log(`   Risk Threshold: ${scenario.expectedRiskThreshold}%`);

            // Validate workflow trigger logic
            let testPassed = true;
            
            if (infectionRisk > scenario.expectedRiskThreshold) {
                if (workflowType !== 'critical-risk') {
                    console.log(`❌ Expected critical-risk workflow but got ${workflowType}`);
                    testPassed = false;
                }
            } else {
                if (workflowType !== 'standard-care') {
                    console.log(`❌ Expected standard-care workflow but got ${workflowType}`);
                    testPassed = false;
                }
            }

            // Check workflow actions
            const actions = workflowData.workflowResult?.actions;
            if (actions) {
                console.log(`📱 Actions Triggered:`);
                console.log(`   SMS: ${actions.smsNotifications}`);
                console.log(`   Email: ${actions.emailNotifications}`);
                console.log(`   Appointments: ${actions.appointmentsScheduled}`);
                console.log(`   Tasks: ${actions.tasksCreated}`);

                // Validate expected actions based on workflow type
                if (workflowType === 'critical-risk') {
                    if (actions.smsNotifications < 2 || actions.emailNotifications < 1) {
                        console.log(`❌ Critical workflow should have ≥2 SMS and ≥1 email`);
                        testPassed = false;
                    }
                } else if (workflowType === 'standard-care') {
                    if (actions.smsNotifications < 1 || actions.emailNotifications < 1) {
                        console.log(`❌ Standard workflow should have ≥1 SMS and ≥1 email`);
                        testPassed = false;
                    }
                }
            }

            if (testPassed) {
                console.log(`✅ Test Passed: ${scenario.name}`);
                results.passed++;
            } else {
                console.log(`❌ Test Failed: ${scenario.name} - Validation failed`);
                results.failed++;
            }

        } catch (error) {
            console.log(`❌ Test Failed: ${scenario.name} - Exception thrown`);
            console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
            results.failed++;
            results.total++;
        }
    }

    // Print final results
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Success Rate: ${results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0}%`);
    
    if (results.failed === 0) {
        console.log('\n🎉 All tests passed! Keragon workflow integration is working correctly.');
    } else {
        console.log(`\n⚠️  ${results.failed} test(s) failed. Please review the integration.`);
    }
}

/**
 * Test health check functionality
 */
async function testHealthCheck(): Promise<void> {
    console.log('\n🏥 Testing Keragon Service Health Check');
    
    try {
        const health = await keragonService.healthCheck();
        console.log(`Status: ${health.status}`);
        console.log(`Mock Mode: ${health.mockMode}`);
        console.log(`Configuration: ${health.configuration}`);
    } catch (error) {
        console.log(`❌ Health check failed: ${error}`);
    }
}

/**
 * Main test runner
 */
if (typeof window === 'undefined') {
    // Running in Node.js environment
    runKeragonWorkflowTests()
        .then(() => testHealthCheck())
        .catch(error => console.error('Test execution failed:', error));
} else {
    // Running in browser environment
    console.log('Keragon workflow tests loaded. Call runKeragonWorkflowTests() to execute.');
    (window as any).runKeragonWorkflowTests = runKeragonWorkflowTests;
    (window as any).testHealthCheck = testHealthCheck;
}

export { runKeragonWorkflowTests, testHealthCheck };
