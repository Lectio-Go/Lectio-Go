import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Image, ColorPropType } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';

  

export class Login extends Component {
    state = {
        country: '1'
    }

    render() {
        return(
        
      <View style={styles.backgroundContainer }>
        <View style={styles.MarginedBox }>
            <Text style={styles.Heading} > Lectio Login </Text>
            
            <Text style={styles.Subheading}> brugernavn </Text>
            
            <View style={styles.SectionStyle}>
                <Image
                    source={require('../Resources/Logo.png')} //Change your icon image here
                    style={styles.ImageStyle1}
                />
                <TextInput
                    style={{ flex: 1, color: 'white'}}
                    placeholder="Indtast brugernavn"
                    placeholderTextColor="white"
                    underlineColorAndroid="transparent"
                />
            </View>

            <Text style={styles.Subheading}> kodeord </Text>
            <View style={styles.SectionStyle}>
                <Image
                    source={require('../Resources/Lock.png')} //Change your icon image here
                    style={styles.ImageStyle2}
                />
                <TextInput
                    style={{ flex: 1, color: 'white'}}
                    placeholder="Indtast kodeord"
                    placeholderTextColor="white"
                    underlineColorAndroid="transparent"
                />
            </View>


            <Text style={styles.Subheading}> skole </Text>
            <View style={{alignItems: 'center'}}>
            <DropDownPicker

                items={[
                    {label: 'vælg skole', value: '1'},
                    {label: 'ZBC Slagelse', value: '2'},
                ]}
                defaultValue={this.state.country}
                containerStyle={{height: 40, alignContent: 'center', width: 300 }}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item => this.setState({
                    country: item.value
                })}
            />
            </View>

        </View>
      </View>
      
        );
    }
}


const styles = StyleSheet.create({

    backgroundContainer:
    {
        backgroundColor: 'rgb(30, 30, 30)', 
        flex: 1, 
        
    },
    MarginedBox:
    {
        marginLeft: '10%',
        marginTop: '30%' ,
        marginRight: '10%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    Heading:
    {
        color: 'rgb(255,255,255)',
        fontWeight: 'bold',
        fontSize: 25,
        paddingBottom: '10%'

    },
    Subheading:
    {
        color: 'rgb(255,255,255)',
        fontSize: 15,
        paddingTop: '5%',

    },
    SectionStyle: {
        color: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(30,30,30)',
        borderWidth: 0.5,
        borderColor: 'white',
        height: 40,
        borderRadius: 5,    
        margin: 10,
    },
    ImageStyle1: {
        padding: 15,
        margin: 5,
        height: 27,
        width: 43,
    },
    ImageStyle2: {
        padding: 0 ,
        margin: 5,
        height: 43,
        width: 43,
        resizeMode: 'stretch',
    }




});