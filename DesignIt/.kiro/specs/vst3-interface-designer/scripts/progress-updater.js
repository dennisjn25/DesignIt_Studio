#!/usr/bin/env node

/**
 * VST3 Interface Designer Progress Tracker
 * Automatically updates progress tracking every 5 minutes
 */

const fs = require('fs').promises;
const path = require('path');

class ProgressTracker {
    constructor() {
        this.projectRoot = path.join(__dirname, '..');
        this.tasksFile = path.join(this.projectRoot, 'tasks.md');
        this.progressFile = path.join(this.projectRoot, 'progress-tracker.md');
        this.logFile = path.join(this.projectRoot, 'progress-log.json');

        this.taskStatuses = {
            'not_started': 'Not Started',
            'in_progress': 'In Progress',
            'completed': 'Completed',
            'blocked': 'Blocked'
        };
    }

    async parseTasksFile() {
        try {
            const content = await fs.readFile(this.tasksFile, 'utf8');
            const lines = content.split('\n');
            const tasks = [];

            for (const line of lines) {
                const taskMatch = line.match(/^- \[([ x-])\] (\d+)\. (.+)/);
                if (taskMatch) {
                    const [, status, number, title] = taskMatch;
                    const taskStatus = status === 'x' ? 'completed' :
                        status === '-' ? 'in_progress' : 'not_started';

                    tasks.push({
                        number: parseInt(number),
                        title: title.trim(),
                        status: taskStatus,
                        rawLine: line
                    });
                }
            }

            return tasks;
        } catch (error) {
            console.error('Error parsing tasks file:', error);
            return [];
        }
    }

    calculateProgress(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const inProgress = tasks.filter(t => t.status === 'in_progress').length;
        const notStarted = tasks.filter(t => t.status === 'not_started').length;
        const blocked = tasks.filter(t => t.status === 'blocked').length;

        return {
            total,
            completed,
            inProgress,
            notStarted,
            blocked,
            completedPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
            inProgressPercent: total > 0 ? Math.round((inProgress / total) * 100) : 0,
            notStartedPercent: total > 0 ? Math.round((notStarted / total) * 100) : 0,
            blockedPercent: total > 0 ? Math.round((blocked / total) * 100) : 0
        };
    }

    calculateMilestoneProgress(tasks) {
        const milestones = [
            { name: 'Foundation & Core Engine', tasks: [1, 2, 3, 4, 5, 6], target: 'Week 2' },
            { name: 'Component System & UI', tasks: [7, 8, 9, 10, 11, 12], target: 'Week 4' },
            { name: 'AI Integration & Templates', tasks: [13, 14, 15, 16, 17, 18], target: 'Week 6' },
            { name: 'Advanced Features', tasks: [19, 20, 21, 22, 23, 24], target: 'Week 8' },
            { name: 'Character System & ML', tasks: [25, 26, 27, 28], target: 'Week 10' },
            { name: 'Testing & Deployment', tasks: [29, 30, 31, 32], target: 'Week 12' }
        ];

        return milestones.map(milestone => {
            const milestoneTasks = tasks.filter(t => milestone.tasks.includes(t.number));
            const completed = milestoneTasks.filter(t => t.status === 'completed').length;
            const total = milestoneTasks.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            let status = 'Not Started';
            if (progress === 100) status = 'Completed';
            else if (progress > 0) status = 'In Progress';

            return {
                ...milestone,
                completed,
                total,
                progress,
                status
            };
        });
    }

    async loadProgressLog() {
        try {
            const content = await fs.readFile(this.logFile, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return { entries: [], startDate: new Date().toISOString() };
        }
    }

    async saveProgressLog(log) {
        await fs.writeFile(this.logFile, JSON.stringify(log, null, 2));
    }

    async updateProgressFile(tasks, progress, milestones) {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        const nextUpdate = new Date(now.getTime() + 5 * 60 * 1000);
        const nextTimestamp = nextUpdate.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

        // Get active and recently completed tasks
        const activeTasks = tasks.filter(t => t.status === 'in_progress').slice(0, 3);
        const recentlyCompleted = tasks.filter(t => t.status === 'completed').slice(-3);
        const upcomingTasks = tasks.filter(t => t.status === 'not_started').slice(0, 3);

        // Calculate current sprint
        const currentMilestone = milestones.find(m => m.status === 'In Progress') || milestones[0];
        const sprintProgress = `${currentMilestone.completed}/${currentMilestone.total}`;

        // Generate task table
        const taskTable = tasks.map(task => {
            const estimatedHours = this.getEstimatedHours(task.number);
            return `| ${task.number}. ${task.title.substring(0, 20)}... | ${this.taskStatuses[task.status]} | ${task.status === 'completed' ? '100%' : task.status === 'in_progress' ? '50%' : '0%'} | ${estimatedHours} | 0 | - | - |`;
        }).join('\n');

        const content = `# VST3 Interface Designer - Progress Tracker

## Project Overview
**Project Name**: VST3 Interface Designer  
**Start Date**: 2025-01-08  
**Target Completion**: TBD  
**Last Updated**: ${timestamp}  

## Progress Summary
- **Total Tasks**: ${progress.total}
- **Completed**: ${progress.completed} (${progress.completedPercent}%)
- **In Progress**: ${progress.inProgress} (${progress.inProgressPercent}%)
- **Not Started**: ${progress.notStarted} (${progress.notStartedPercent}%)
- **Blocked**: ${progress.blocked} (${progress.blockedPercent}%)

## Current Sprint Status
**Sprint**: ${currentMilestone.name}  
**Sprint Goal**: ${this.getSprintGoal(currentMilestone.name)}  
**Sprint Progress**: ${sprintProgress} tasks completed  

### Active Tasks
${activeTasks.length > 0 ? activeTasks.map(t => `- ${t.number}. ${t.title}`).join('\n') : '- None currently active'}

### Recently Completed
${recentlyCompleted.length > 0 ? recentlyCompleted.map(t => `- ${t.number}. ${t.title}`).join('\n') : '- None yet'}

### Upcoming Tasks (Next 3)
${upcomingTasks.map(t => `${t.number}. ${t.title}`).join('\n')}

## Milestone Progress

${milestones.map(m => `### Milestone ${milestones.indexOf(m) + 1}: ${m.name} (Tasks ${m.tasks[0]}-${m.tasks[m.tasks.length - 1]})
- **Progress**: ${m.completed}/${m.total} (${m.progress}%)
- **Target Date**: ${m.target}
- **Status**: ${m.status}`).join('\n\n')}

## Detailed Task Status

| Task | Status | Progress | Estimated Hours | Actual Hours | Assignee | Notes |
|------|--------|----------|----------------|--------------|----------|-------|
${taskTable}

## Time Tracking
- **Total Estimated Hours**: ${this.getTotalEstimatedHours()}
- **Total Actual Hours**: 0
- **Remaining Hours**: ${this.getTotalEstimatedHours()}
- **Average Hours per Day**: 0
- **Projected Completion**: TBD

## Blockers & Issues
${tasks.filter(t => t.status === 'blocked').length > 0 ?
                tasks.filter(t => t.status === 'blocked').map(t => `- Task ${t.number}: ${t.title}`).join('\n') :
                '- None currently identified'}

## Notes & Updates
- Project specification completed
- Ready to begin implementation
- Next: Set up development environment

---
*Last auto-update: ${timestamp}*  
*Next update: ${nextTimestamp}*`;

        await fs.writeFile(this.progressFile, content);
    }

    getEstimatedHours(taskNumber) {
        const estimates = {
            1: 8, 2: 12, 3: 16, 4: 10, 5: 12, 6: 14, 7: 10, 8: 8, 9: 12, 10: 10,
            11: 16, 12: 12, 13: 14, 14: 18, 15: 12, 16: 10, 17: 20, 18: 8, 19: 16, 20: 14,
            21: 12, 22: 10, 23: 12, 24: 10, 25: 14, 26: 16, 27: 18, 28: 12, 29: 20, 30: 12,
            31: 10, 32: 16
        };
        return estimates[taskNumber] || 8;
    }

    getTotalEstimatedHours() {
        return 424; // Sum of all estimated hours
    }

    getSprintGoal(milestoneName) {
        const goals = {
            'Foundation & Core Engine': 'Establish project foundation and core canvas functionality',
            'Component System & UI': 'Build component library and user interface',
            'AI Integration & Templates': 'Integrate AI assistance and template system',
            'Advanced Features': 'Implement advanced design and collaboration features',
            'Character System & ML': 'Add character design and machine learning capabilities',
            'Testing & Deployment': 'Complete testing and prepare for deployment'
        };
        return goals[milestoneName] || 'Complete assigned tasks';
    }

    async run() {
        try {
            console.log(`[${new Date().toISOString()}] Updating progress tracker...`);

            const tasks = await this.parseTasksFile();
            const progress = this.calculateProgress(tasks);
            const milestones = this.calculateMilestoneProgress(tasks);

            // Update progress file
            await this.updateProgressFile(tasks, progress, milestones);

            // Log progress
            const log = await this.loadProgressLog();
            log.entries.push({
                timestamp: new Date().toISOString(),
                progress,
                activeTasks: tasks.filter(t => t.status === 'in_progress').length,
                completedTasks: tasks.filter(t => t.status === 'completed').length
            });

            // Keep only last 100 entries
            if (log.entries.length > 100) {
                log.entries = log.entries.slice(-100);
            }

            await this.saveProgressLog(log);

            console.log(`Progress updated: ${progress.completed}/${progress.total} tasks completed (${progress.completedPercent}%)`);

        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    startAutoUpdate() {
        console.log('Starting VST3 Interface Designer progress tracker...');
        console.log('Updates every 5 minutes. Press Ctrl+C to stop.');

        // Run immediately
        this.run();

        // Then run every 5 minutes
        setInterval(() => {
            this.run();
        }, 5 * 60 * 1000); // 5 minutes
    }
}

// Run the tracker
if (require.main === module) {
    const tracker = new ProgressTracker();
    tracker.startAutoUpdate();
}

module.exports = ProgressTracker;