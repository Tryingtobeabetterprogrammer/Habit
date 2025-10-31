import * as Location from 'expo-location';

export const startLocationTracking = async (onLocationUpdate) => {
  console.log('🚀 Starting location tracking...');
  
  try {
    console.log('🔍 Requesting location permission...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('🔑 Permission status:', status);
    
    if (status !== 'granted') {
      throw new Error('❌ Permission to access location was denied');
    }

    console.log('📍 Getting current location...');
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    console.log('✅ Initial location acquired');
    onLocationUpdate(location);
    await getAddressFromCoords(location.coords, onLocationUpdate);

    console.log('👀 Setting up location watcher...');
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
        timeInterval: 5000,
      },
      async (newLocation) => {
        console.log('\n🔄 Location updated');
        onLocationUpdate(newLocation);
        await getAddressFromCoords(newLocation.coords, onLocationUpdate);
      }
    );

    return () => {
      console.log('🧹 Cleaning up location watcher...');
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  } catch (error) {
    console.error('❌ Error in location tracking:', error);
    throw error;
  }
};

const getAddressFromCoords = async (coords, onLocationUpdate) => {
  try {
    const { latitude, longitude } = coords;
    console.log('\n=== NEW LOCATION DETECTED ===');
    console.log('Coordinates:', { 
      latitude: latitude.toFixed(6), 
      longitude: longitude.toFixed(6) 
    });
    
    const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (addressResponse && addressResponse[0]) {
      const { city, region, country, postalCode, name, street } = addressResponse[0];
      const fullAddress = `${street || name || ''}${city ? `, ${city}` : ''}${region ? `, ${region}` : ''}${postalCode ? ` ${postalCode}` : ''}, ${country}`;
      
      console.log('Address Details:', {
        street: street || 'N/A',
        city: city || 'N/A',
        region: region || 'N/A',
        postalCode: postalCode || 'N/A',
        country: country || 'N/A',
        fullAddress
      });
      
      onLocationUpdate(prev => ({ ...prev, address: fullAddress }));
      return fullAddress;
    }
  } catch (error) {
    console.error('❌ Error getting address:', error);
  }
  return null;
};