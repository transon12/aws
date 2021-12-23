<?php


namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CallApiService
{
    protected $client;
    protected $base_url;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => 'https://tuanchau.cftsoft.com:1730/api/dichvu/']);
//        $this->base_url = config('app.sky_api_url');
    }

    public function request($http_method, $api_url, $parameter = '', $api_name)
    {
        $Start = microtime(1);

        Log::info('Start call API [' . $api_name . '] - user_id:' . Auth::user()->id . ' user_name:' . Auth::user()->name);
        try {
            if ($parameter == '') $parameter = array();
            $response = $this->client->request(
                $http_method,
                $api_url,
                $parameter,

            );
            $End = microtime(1);
            Log::info('end call API [' . $api_name . '] - totalTime: '.($End -$Start).' - user_id: ' . Auth::user()->id . ' user_name: ' . Auth::user()->name);
            return $response->getBody()->getContents();
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $contents = $e->getResponse()->getBody()->getContents();
                if (is_string($contents) && is_array(json_decode($contents, true))) {
                    if (json_decode($contents)->ErrorCode == 40130 && $api_name == "GetFormFieldInfo") {
                        return json_encode(['InputFormInfo' => ['InputForm' => []]]);
                    }
                }

                Log::error(Psr7\str($e->getResponse()));
                if (is_string($contents) && is_array(json_decode($contents, true)) && (json_last_error() == JSON_ERROR_NONE)) {
                    $json = json_decode($contents, true);
                    if (array_key_exists('ErrorMessage', $json)) {
                        Log::error('Call api error - userInfo : [id : ' . Auth::user()->id . ']' . 'apiInfo : [' . $api_name . '] errorInfo : [' . 'HttpStatusCode : ' . $json['HttpStatusCode'] . ' , ErrorCode : ' . $json['ErrorCode'] . ' , ErrorMessage : ' . $json['ErrorMessage'] . ']');
                        throw $e;
                    }
                }
            }
            Log::error('Call API error [' . $api_name . '] request error - user_id:' . Auth::user()->id . 'user_name:' . Auth::user()->name);
            Log::error(Psr7\str($e->getRequest()));
            throw $e;
        } catch (\Exception $e) {
            Log::error($e);
            Log::error('Call API [' . $api_name . '] error abnormal - user_id:' . Auth::user()->id . 'user_name:' . Auth::user()->name);
            throw $e;
        }
    }

    public function GetAPI()
    {
        return $this->request(
            'GET',
            'pha/danh_sach_loai_hinh', '',
            'GET API LIST'
        );
    }
}
