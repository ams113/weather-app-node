const inquirer = require('inquirer');
require('colors');

const showHeader = () => {
    console.clear();
    console.log('============================='.grey);
    console.log('   Select an option'.green);
    console.log('=============================\n'.grey);
};

const menu = [
        {
            value: 1,
            name: `${'1.'.green} Search city` 
        },
        {
            value: 2,
            name: `${'2.'.green} History` 
        },
        {
            value: 0,
            name: `${'0.'.green} Exit`
        }
    ];

const optionsMenu = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: menu
    }
];

const questionPause = [
    {
        type: 'input',
        prefix: '>>'.green,
        name: 'enter',
        message: `Press ${ 'ENTER'.blue } to continue`,
    }
];


const inquirerMenu = async() => {
    showHeader();
    const { option } = await inquirer.prompt( optionsMenu );
    return option;
};

const pause = async() => {
    console.log('\n');
    const pause = await inquirer.prompt( questionPause );
    return pause;
};

const readInput = async( message ) => {

    const questionInput = [
        {
            type: 'input',
            prefix: '>>'.green,
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ){
                    return 'Please enter a value'.red;
                }
                return true;
            }
        }
    ];
    const { desc } = await inquirer.prompt( questionInput );
    return desc;
};

const placesList = async( places = [] ) =>{

    const choices = places.map( ( place, index ) => {

        const idx = `${ index + 1 }.`.green;

        return {
            value: place.id,
            name: `${ idx } ${ place.name }`
        };
    });

    choices.unshift({
        value: '0',
        name: `${ '0.'.green } Back <-`
    });

    questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select place:',
            choices
        }
    ];

    const { id } = await inquirer.prompt( questions );

    return id;

};

const confirm = async( message ) => {

    const question = [
        {
            type:'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt( question );

    return ok;

};

const checkListMenu = async( tasks = [] ) =>{

    const choices = tasks.map( ( task, index ) => {

        const idx = `${ index + 1 }.`.blue;

        return {
            value: task.id,
            name: `${ idx } ${ task.desc }`,
            checked: ( task.dateCompleted ) ? true : false
        };
    });


    optionChek = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selections',
            choices
        }
    ];

    const { ids } = await inquirer.prompt( optionChek );

    return ids;

};


module.exports = {
    inquirerMenu,
    pause,
    readInput,
    placesList,
    confirm,
    checkListMenu
};