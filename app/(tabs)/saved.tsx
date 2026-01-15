import MoviesCard from '@/components/MoviesCard';
import { icons } from '@/React Native Movie App (assets)/constants/icons';
import { images } from '@/React Native Movie App (assets)/constants/images';
import { getSavedMovies } from '@/services/appwrite';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

const Saved = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSavedMovies();
      // Map Appwrite fields to what MoviesCard expects
      const mappedMovies = data.map((doc: any) => ({
        id: doc.movieId,
        ...doc
      }));
      setMovies(mappedMovies);
    } catch (error) {
      console.error('Error fetching saved movies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved])
  );

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <View className="flex-1 px-5 pt-20">
        <Text className="text-white text-2xl font-bold mb-5">Saved Movies</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#eb8c33" className="mt-20" />
        ) : movies.length === 0 ? (
          <View className="flex-1 justify-center items-center pb-20">
            <Image source={icons.save} className="size-16 opacity-20" tintColor="#fff" />
            <Text className="text-gray-400 mt-4 text-lg">No saved movies yet.</Text>
          </View>
        ) : (
          <FlatList
            data={movies}
            renderItem={({ item }) => <MoviesCard {...item} />}
            keyExtractor={(item) => item.$id}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              gap: 20,
              marginBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
};

export default Saved;